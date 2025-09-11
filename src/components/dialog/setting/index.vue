<!--
 * @Author: KESHAOYE
 * @Date: 2022-11-26 14:04:48
-->
<template>
  <el-dialog
    title="设置"
    :visible.sync="data_visiable"
    :close-on-click-modal="false"
    :before-close="closeDialog"
    append-to-body
    width="70%"
  >
    <el-container style="height: 500px">
      <el-aside width="200px">
        <el-menu :collapse="collapse" default-active="1" @select="changeSelect">
          <el-menu-item
            v-for="(i, key) in settingMenu"
            :index="i.index.toString()"
            :key="key"
          >
            <i :class="i.icon"></i>
            <span slot="title">{{ i.name }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div class="setting_title">
            {{ settingMenu[nowSetting - 1].name }}
          </div>
          <div class="setting_descript">
            {{ settingMenu[nowSetting - 1].descript }}
          </div>
        </el-header>
        <el-main style="padding-top: 0">
          <message v-if="settingMenu[nowSetting - 1].components == 'message'" />
          <wxTestMessage
            v-if="settingMenu[nowSetting - 1].components == 'wxTestMessage'"
          />
          <common v-if="settingMenu[nowSetting - 1].components == 'common'" />
          <about v-if="settingMenu[nowSetting - 1].components == 'about'" />
          <position
            v-if="settingMenu[nowSetting - 1].components == 'position'"
          />
        </el-main>
      </el-container>
    </el-container>
  </el-dialog>
</template>

<script>
import message from "./message.vue";
import common from "./common.vue";
import about from "./about.vue";
import wxTestMessage from "./wxTestMessage.vue";
import position from "./position.vue";
export default {
  data() {
    return {
      data_visiable: false,
      collapse: false,
      settingMenu: [
        {
          index: 1,
          icon: "el-icon-chat-dot-round",
          name: "新消息",
          descript: "消息通知方式、server酱",
          components: "message",
        },
        {
          index: 2,
          icon: "el-icon-chat-round",
          name: "微信测试号（Beta）",
          descript: "微信测试号通知配置",
          components: "wxTestMessage",
        },
        {
          index: 3,
          icon: "el-icon-s-opportunity",
          name: "通用",
          descript: "间隔时长、模式",
          components: "common",
        },
        {
          index: 4,
          icon: "el-icon-position",
          name: "定位",
          descript: "当前所在城市、店铺",
          components: "position",
        },
        {
          //el-icon-collection
          index: 5,
          icon: "el-icon-s-platform",
          name: "关于",
          descript: "版本信息",
          components: "about",
        },
      ],
      nowSetting: 1,
    };
  },
  components: {
    message,
    wxTestMessage,
    common,
    about,
    position,
  },
  computed: {},
  watch: {},
  methods: {
    closeDialog() {
      this.data_visiable = false;
    },
    changeSelect(index) {
      this.nowSetting = index;
    },
  },
  mounted() {
    this.$EventBus.$on("toggleSetting", (state) => {
      this.data_visiable = state;
    });
  },
};
</script>

<style lang="scss">
.setting_title {
  font-size: 18px;
  font-weight: bold;
}
.setting_descript {
  font-size: 14px;
  font-weight: lighter;
  color: #d2d2d2;
  margin-top: 5px;
}
</style>
