import axios from "axios";
import Vue from "vue";
import { useAppStore } from "@/utils/pinia";
export async function getWxAccessToken() {
  const app = useAppStore();
  const { wechatTestMessage, wechat_appId, wechat_appSecret } =
    app?.setting || {};
  if (!wechatTestMessage) throw new Error("微信测试号推送未开启");
  if (!wechat_appId || !wechat_appSecret)
    throw new Error("请先填写 AppId / AppSecret");

  const { data } = await axios.get("/wx/cgi-bin/token", {
    params: {
      grant_type: "client_credential",
      appid: wechat_appId,
      secret: wechat_appSecret,
    },
  });
  if (data?.access_token) return data.access_token;
  throw new Error(data?.errmsg || "获取 access_token 失败");
}

export async function sendWeChatTemplate({
  touser,
  template_id,
  url,
  data,
  miniprogram,
}) {
  const access_token = await getWxAccessToken();
  const { data: res } = await axios.post(
    "/wx/cgi-bin/message/template/send",
    { touser, template_id, url, data, miniprogram },
    { params: { access_token } }
  );
  if (res?.errcode === 0) return res;
  throw new Error(res?.errmsg || JSON.stringify(res));
}

export async function sendWeChatNotify(
  selectInfo,
  storeInfo,
  pickupSearchQuote,
  url
) {
  const app = useAppStore();
  const { wechatTestMessage, wechat_templateId, wechat_userId } =
    app?.setting || {};
  if (!wechatTestMessage) throw new Error("微信测试号推送未开启");
  if (!wechat_templateId || !wechat_userId)
    throw new Error("模板ID / 用户ID 未填写");

  const payload = {
    keyword1: {
      value: `${selectInfo?.selectModel || ""} ${
        selectInfo?.selectColor || ""
      } ${selectInfo?.selectRom || ""}`,
    },
    keyword2: { value: pickupSearchQuote || "库存状态变动" },
    keyword3: { value: storeInfo?.name || "" },
    keyword4: { value: url || "" },
    remark: { value: "请尽快下单～" },
    brands: {
      value: "消息来自Chinese Apple Store Observer，点击详情跳转至购买页面",
    },
  };

  return sendWeChatTemplate({
    touser: wechat_userId,
    template_id: wechat_templateId,
    url: url || storeInfo?.link || "",
    data: payload,
  });
}

export async function testWeChatConfig({ sendTest = false } = {}) {
  const app = useAppStore();
  const { wechat_templateId, wechat_userId } = app?.setting || {};
  await getWxAccessToken();

  if (!sendTest) return "已成功获取 token";

  if (!wechat_templateId || !wechat_userId) {
    throw new Error("请先填写模板ID和用户ID再试发送测试消息");
  }
  await sendWeChatTemplate({
    touser: wechat_userId,
    template_id: wechat_templateId,
    url: location.origin,
    data: {
      keyword1: { value: "这里显示型号" },
      keyword2: { value: "这里显示状态" },
      keyword3: { value: "这里显示Apple Store" },
      keyword4: { value: "这里显示购买链接" },
      remark: { value: "这是测试消息" },
      brands: { value: "消息来自Chinese Apple Store Observere" },
    },
  });
  return "测试模板消息已发送";
}

export async function testWeChatConfigWithToast(opts = {}) {
  try {
    const r = await testWeChatConfig(opts);
    msg()?.success?.(
      opts.sendTest ? "测试消息已发送" : "AppId/AppSecret 校验成功"
    );
    return r;
  } catch (e) {
    msg()?.error?.(`微信配置检查失败：${e?.message || e}`);
    throw e;
  }
}

export const WECHAT_TEMPLATE = [
  "{{brands.DATA}}",
  "—————————————————————",
  "您监控的商品库存更新了！{{remark.DATA}}",
  "详细信息如下：",
  "📱 商品：{{keyword1.DATA}}",
  "🏬 店铺：{{keyword3.DATA}}",
  "🗃️ 当前状态：{{keyword2.DATA}}",
  "🔗 链接：{{keyword4.DATA}}",
].join("\n");

/**
 * 复制模板文本
 * @param {string=} text 不传则使用默认模板
 * @returns {Promise<boolean>} 复制是否成功
 */
export async function copyTemplate(text) {
  const content = (text ?? WECHAT_TEMPLATE).trim();

  if (window.isSecureContext && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(content);
      return true;
    } catch (e) {}
  }

  const ta = document.createElement("textarea");
  ta.value = content;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.top = "-9999px";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.focus({ preventScroll: true });
  ta.select();
  ta.setSelectionRange(0, ta.value.length);

  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {}
  document.body.removeChild(ta);

  if (!ok) {
    throw new Error("复制失败：请确保在 HTTPS 环境且由用户点击触发。");
  }
  return true;
}
