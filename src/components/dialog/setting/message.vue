<!--
 * @Author: KESHAOYE
 * @Date: 2022-11-26 14:33:51
-->
<template>
  <div class="settings">
    <div class="setting_item">
      <div class="tips">
        <div class="content">弹窗通知</div>
        <div class="descript">
          默认是否开启全局弹窗通知（请开启浏览器通知权限）
        </div>
      </div>
      <el-switch v-model="dialogMessage" />
    </div>
    <div
      class="setting_item"
      :class="serverchanMessage ? 'setting_item_withoutbottom' : ''"
    >
      <div class="tips">
        <div class="content">server酱通知</div>
        <div class="descript">默认是否开启server酱通知(需配置)</div>
      </div>
      <el-switch v-model="serverchanMessage" />
    </div>
    <div class="setting_item" v-if="serverchanMessage">
      <el-input
        v-model="serverchanKey"
        style="width: 350px"
        size="mini"
        placeholder="配置server酱的send_key"
      />
      <el-link
        href="https://sct.ftqq.com/sendkey"
        target="_blank"
        type="danger"
      >
        生成KEY
      </el-link>
      <el-link href="https://sct.ftqq.com/" target="_blank" type="danger">
        查看教程
      </el-link>
    </div>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useAppStore } from "@/utils/pinia";

export default {
  name: "SettingMessage",
  data() {
    return {
      serverchan_key: "",
    };
  },

  computed: {
    ...mapStores(useAppStore),
    dialogMessage: {
      get() {
        return this.appStore.setting.dialogMessage;
      },
      async set(val) {
        if (val) {
          try {
            if (typeof Notification === "undefined") {
              this.$message.error("当前浏览器不支持通知");
              val = false;
            } else if (Notification.permission !== "granted") {
              const perm = await Notification.requestPermission();
              if (perm !== "granted") {
                this.$message.error("功能不可用, 无通知权限");
                val = false;
              }
            }
          } catch (_) {
            val = false;
          }
        }
        this.appStore.setMessage("dialogMessage", val);
      },
    },

    serverchanMessage: {
      get() {
        return this.appStore.setting.serverchanMessage;
      },
      set(val) {
        this.appStore.setMessage("serverchanMessage", val);
      },
    },

    serverchanKey: {
      get() {
        return this.appStore.setting.serverchan_sendkey;
      },
      set(val) {
        this.appStore.setMessage("serverchan_sendkey", val);
        this.$message.success("send_key保存成功");
      },
    },
  },
};
</script>

<style lang="scss">
.settings {
  .setting_item_withoutbottom {
    border: 0 !important;
  }
  .setting_item {
    width: 600px;
    min-height: 50px;
    margin-top: 10px;
    border-bottom: 1px solid #f8f8f8;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    .tips {
      width: 230px;
      font-size: 14px;
      font-weight: lighter;
      margin-top: 0px;
      .descript {
        font-size: 13px;
        color: #c4c3c3;
        margin-top: 2px;
      }
    }
  }
}
</style>
