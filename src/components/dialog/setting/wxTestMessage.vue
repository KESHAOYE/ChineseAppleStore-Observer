<template>
  <div class="settings">
    <div class="wxSettings">
      <div class="setting_item wx_settings_item">
        <div class="tips">
          <div class="content">当前状态</div>
          <div class="descript">目前微信测试号推送服务是否开启</div>
        </div>
        <div>
          <span class="wx_is_open">{{
            wechatTestMessage ? "开启（需自行检测配置）" : "关闭"
          }}</span>
          <el-button
            size="mini"
            type="primary"
            :loading="sendLoading"
            v-if="wechatTestMessage"
            @click="test"
            >发送测试消息</el-button
          >
        </div>
      </div>
      <div class="setting_item wx_settings_item">
        <div class="tips">
          <div class="content">AppId</div>
          <div class="descript">微信官方提供的AppID</div>
        </div>
        <el-input
          v-model="wechat_appId"
          placeholder="请输入AppID"
          style="width: 300px"
          size="mini"
        ></el-input>
      </div>
      <div class="setting_item wx_settings_item">
        <div class="tips">
          <div class="content">AppSecret</div>
          <div class="descript">微信官方提供的AppSecret</div>
        </div>
        <el-input
          v-model="wechat_appSecret"
          placeholder="请输入AppSecret"
          style="width: 300px"
          size="mini"
        ></el-input>
      </div>
      <div class="setting_item wx_settings_item">
        <div class="tips">
          <div class="content">模板ID</div>
          <div class="descript">生成模板后的ID</div>
        </div>
        <el-input
          v-model="wechat_templateId"
          placeholder="模版需要按照要求配置，点击右侧复制"
          style="width: 250px"
          size="mini"
        ></el-input>
        <el-link @click="tech">复制模板</el-link>
      </div>
      <div class="setting_item setting_item_withoutbottom wx_settings_item">
        <div class="tips">
          <div class="content">用户ID</div>
          <div class="descript">微信号（官方面板提供）</div>
        </div>
        <el-input
          v-model="wechat_userId"
          placeholder="请输入用户ID"
          style="width: 300px"
          size="mini"
        ></el-input>
      </div>
      <div>
        <el-button size="mini" @click="tech">查看教程</el-button>
        <el-button
          size="mini"
          type="primary"
          v-if="!wechatTestMessage"
          @click="openService"
          >保存并开启</el-button
        >
        <el-button
          size="mini"
          type="danger"
          v-if="wechatTestMessage"
          @click="closeService"
          >关闭服务</el-button
        >
      </div>
    </div>
    <div class="wxtips">
      ios设备特别提示：点击微信消息详情，页面加载完成后点击“用默认浏览器打开（Safari）,可直接调起Apple
      Store APP”
    </div>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useAppStore } from "@/utils/pinia";
import { testWeChatConfig } from "@/utils/wechatTestMessage";
export default {
  name: "wxTestMessage",
  data() {
    return {
      sendLoading: false,
    };
  },
  methods: {
    async test() {
      try {
        this.sendLoading = true;
        await testWeChatConfig({
          sendTest: true,
        });
        this.$message.success("发送成功");
      } catch (e) {
        this.$message.error(e.message);
      }
      this.sendLoading = false;
    },
    tech() {
      this.$message.warning("当前版本未配置");
    },
    openService() {
      const pinia = useAppStore();
      const {
        wechat_appId,
        wechat_appSecret,
        wechat_templateId,
        wechat_userId,
      } = pinia.setting;
      if (
        !wechat_appId ||
        !wechat_appSecret ||
        !wechat_templateId ||
        !wechat_userId
      ) {
        return this.$message.error("开启失败，配置不完整！");
      }
      pinia.setMessage("wechatTestMessage", true);
      this.$message.success("已开启微信测试号通知服务，可点击上方发送测试信息");
    },
    closeService() {
      const pinia = useAppStore();
      pinia.setMessage("wechatTestMessage", false);
      this.$message.success("已关闭微信测试号通知服务");
    },
  },
  computed: {
    ...mapStores(useAppStore),
    wechatTestMessage: {
      get() {
        return this.appStore.setting.wechatTestMessage;
      },
    },
    wechat_appId: {
      get() {
        return this.appStore.setting["wechat_appId"];
      },
      set(val) {
        this.appStore.setMessage("wechat_appId", val);
        this.$message.success("appId保存成功");
      },
    },
    wechat_appSecret: {
      get() {
        return this.appStore.setting["wechat_appSecret"];
      },
      set(val) {
        this.appStore.setMessage("wechat_appSecret", val);
        this.$message.success("appSecret保存成功");
      },
    },
    wechat_templateId: {
      get() {
        return this.appStore.setting["wechat_templateId"];
      },
      set(val) {
        this.appStore.setMessage("wechat_templateId", val);
        this.$message.success("模板ID保存成功");
      },
    },
    wechat_userId: {
      get() {
        return this.appStore.setting["wechat_userId"];
      },
      set(val) {
        this.appStore.setMessage("wechat_userId", val);
        this.$message.success("用户ID保存成功");
      },
    },
  },
};
</script>

<style lang="scss" scope>
.wx_is_open {
  margin-right: 5px;
}
.wxtips {
  margin-top: 10px;
  font-size: 12px;
  color: #bfbfbf;
}
</style>
