/*
 * @Author: KESHAOYE
 * @Date: 2025-8-28
 */
import Vue from "vue";
import { useAppStore } from "@/utils/pinia.js";
import { sendServerChan } from "@/data/api";
import { MAX_TASK_LIST } from "@/constant";
import { nanoid } from "nanoid";

import ObserverWorker from "./observer.worker.js?worker";
import messageUrl from "@/assets/message.mp3";
import moment from "moment";
import { sendWeChatNotify } from "./wechatTestMessage";

/**
 * 商城模式监听
 */
let workers = new Map();

export function isAfterNow(dateStr) {
  const m = moment(dateStr, "YYYY-MM-DD HH:mm:ss", true);
  if (!m.isValid()) return false;
  return m.isAfter(moment());
}
export function beginObserve(
  selectInfo,
  storeInfo,
  useServerChan,
  interval,
  now
) {
  return new Promise((resolve, reject) => {
    const app = useAppStore();
    const name = nanoid();
    const nowTime = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;

    // 判断同商店是否有相同任务在运行
    if (!app.isExistTask?.(selectInfo.selectSku, storeInfo.id)) {
      reject("该任务正在运行中,请不要重复添加");
      return;
    }
    if (app.taskCount >= MAX_TASK_LIST) {
      reject(
        `当前已达任务上限,请终止部分任务后继续(任务上限制为${MAX_TASK_LIST})`
      );
      return;
    }

    // 判断是否开售
    if (isAfterNow(selectInfo.openDate)) {
      reject("该商品尚未开售,开售时间为:" + selectInfo.openDate);
      return;
    }

    Vue.prototype.$message.success("开始监控啦!");
    if (app.setting.dialogMessage) {
      dialogMessage(
        "开始监控啦",
        "请不要关闭页面，可将页面放至后台运行",
        null,
        2000
      );
    }

    app.addTask({
      task: null,
      taskId: name,
      intervalTime: "00:00:00",
      interval: null,
      beginTime: nowTime,
      endTime: "",
      location: `${storeInfo.address.stateName} ${storeInfo.address.city}`,
      storeInfo,
      shopInfo: selectInfo,
      state: "observering",
      count: 0,
      log: [],
    });

    const w = new ObserverWorker();
    workers.set(name, w);

    w.postMessage({
      type: "beginObserve",
      name,
      useServerChan,
      useDialogMessage: app.setting.dialogMessage,
      useWechatMessage: app.setting.wechatTestMessage,
      errorStop: app.setting.errorStop,
      interval,
      selectInfo,
      storeInfo,
      now,
    });

    w.onmessage = async (event) => {
      const data = event.data;
      switch (data.type) {
        case "vuexTaskValue":
          app.taskValue({ name: data.name, task: data.task });
          break;
        case "vuexAddTaskLog":
          app.addTaskLog({ name: data.name, result: data.result });
          break;
        case "stopTask":
          stopTask(data.intervalTask, data.name, data.message);
          break;
        case "error":
          stopTask(
            data.intervalTask,
            data.name,
            "error",
            data.message ?? "发生错误，自动结束",
            true
          );
          break;
        case "wechatMessage":
          await sendWeChatNotify(
            selectInfo,
            storeInfo,
            data.pickupSearchQuote,
            data.href
          );
          Vue.prototype.$message.success("微信通知发送成功");
          break;
        case "audioMessage":
          audioMessage();
          break;
        case "serverChan":
          sendMessage(selectInfo, storeInfo, data.pickupSearchQuote, data.href);
          break;
        case "dialogMessage":
          dialogMessage(data.title, data.message, data.href);
          break;
        case "resolve":
          resolve({
            storeInfo,
            modelInfo: selectInfo,
            pickupDisplay: data.pickupDisplay,
            time: data.time,
          });
          break;
        default:
          console.error(`未捕获事件 ${data.type}`, data);
      }
    };
  });
}

// 微信接口号
function wechatJKMessage() {}

function sendMessage(selectInfo, storeInfo, pickupSearchQuote, href) {
  const app = useAppStore();
  const sendkey = app.setting.serverchan_sendkey ?? "";
  sendServerChan({
    sendkey,
    title: "您监控的商品有货啦!!",
    content: `您监控的${selectInfo.selectModel} ${selectInfo.selectColor} ${selectInfo.selectRom}有货啦!当前状态为：${pickupSearchQuote},店铺为：${storeInfo.name}，购买链接为：${href}`,
  })
    .then((data) => {
      console.log(`${data}`);
    })
    .catch((err) => {
      const msg = err?.response?.data?.message || String(err);
      Vue.prototype.$message.error(`server酱发生错误，${msg}，请检查`);
    });
}

function audioMessage() {
  const player = new Audio(messageUrl);
  player.play().catch(() => {});
}

function dialogMessage(title, message, href, interval = 8000) {
  const app = useAppStore();

  // 统一把 interval 解析成毫秒
  const parseToMs = (v) => {
    if (typeof v === "number") {
      // 约定：<=60 认为是“秒”，否则认为已是“毫秒”
      return v <= 60 ? v * 1000 : v;
    }
    if (typeof v === "string") {
      const m = v.trim().toLowerCase();
      if (m.endsWith("ms")) return parseInt(m, 10);
      if (m.endsWith("s")) return parseFloat(m) * 1000;
      // 纯数字字符串：同上规则
      const num = Number(m);
      return isNaN(num) ? 8000 : num <= 60 ? num * 1000 : num;
    }
    return 8000;
  };
  const durationMs = parseToMs(interval);

  const openHref = () => href && window.open(href, "_blank");

  const fallbackNotify = () => {
    Vue.prototype.$notify?.({
      title,
      message,
      type: "success",
      duration: durationMs, // 用统一毫秒时长
      onClick: openHref,
    });
  };

  if (!("Notification" in window)) {
    console.log("环境不完整");
    fallbackNotify();
    return;
  }

  const isSecure =
    window.isSecureContext ||
    location.protocol === "https:" ||
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1";

  if (!isSecure) {
    console.log("非安全环境，无法触发浏览器通知");
    fallbackNotify();
    return;
  }

  if (Notification.permission === "granted") {
    const sticky = !(durationMs > 0); // 非正数时常驻
    const n = new Notification(title, {
      lang: "zh-CN",
      body: message,
      requireInteraction: sticky,
    });

    n.onclick = () => {
      try {
        window.focus();
      } catch {}
      openHref();
      n.close();
    };

    // 仅当需要自动关闭时设置定时器
    if (!sticky) {
      setTimeout(() => {
        try {
          n.close();
        } catch {}
      }, durationMs);
    }
    return;
  }

  if (Notification.permission === "denied") {
    app.setMessage?.(["dialogMessage", false]);
    Vue.prototype.$message?.error?.(
      "系统/浏览器已禁用站点通知，请到设置中开启"
    );
    return;
  }

  // 未授权（default）时，按原逻辑走 UI 通知
  fallbackNotify();
}

export function stopTask(
  task,
  taskId,
  status,
  message = "任务已完成,自动结束",
  error = false
) {
  const app = useAppStore();
  const index = app.task.findIndex((el) => el.taskId == taskId);
  if ((index !== -1 && app.task[index].count > 0) || error) {
    app.stopTask([taskId, message, status]);
    const w = workers.get(taskId);
    if (w) {
      w.postMessage({ type: "stop", intervalTask: task });
    }
  } else {
    Vue.prototype.$message.error("暂不能取消");
  }
}
