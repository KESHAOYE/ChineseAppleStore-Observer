// src/stores/app.js
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    model: { skus: [], roms: [], models: [] },
    nowImage:
      "https://www.apple.com.cn/newsroom/images/apple-logo_black.jpg.landing-big.jpg",
    categoryIndex: -1, // 当前品类
    selectTypeId: -1, // 选择机型系列
    interval: 3000,
    task: [],
    setting: {
      dialogMessage: false,
      serverchanMessage: false,
      serverchan_sendkey: "",
      wechatTestMessage: false,
      wechat_appId: null,
      wechat_appSecret: null,
      wechat_templateId: null,
      wechat_userId: null,
      startNow: false, //是否马上开始执行
      defaultStore: null,
    },
    version: "1.4.1-250912",
  }),

  getters: {
    isExistTask: (state) => (sku, storeId) => {
      let ok = true;
      state.task.forEach((t) => {
        if (
          t.shopInfo?.selectSku === sku &&
          t.storeInfo?.id === storeId &&
          t.state !== "stop" &&
          t.state !== "success"
        ) {
          ok = false;
        }
      });
      return ok;
    },
    taskCount: (state) =>
      state.task.filter((e) => e.state === "observering").length,
  },

  actions: {
    changeCategoryIndex(n) {
      this.categoryIndex = n;
    },
    changeSelectTypeId(n) {
      this.selectTypeId = n;
    },
    changeInterval(t) {
      this.interval = t;
    },
    changeStartNow(val) {
      this.setting.startNow = val;
    },
    changeTaskInterval([index, interval]) {
      if (this.task[index]) this.task[index].interval = interval;
    },

    addTask(config) {
      const event = new Event("addTask");
      event.taskId = config.taskId;
      this.task.push(config);
      window.dispatchEvent(event);
    },

    changeNowImage(val) {
      this.nowImage = val;
    },

    changeModel([key, value, isClear]) {
      if (!this.model[key]) this.model[key] = [];
      if (isClear) this.model[key] = [];
      else this.model[key].push(value);
    },

    changeVersion(val) {
      this.version = val;
    },

    taskValue({ name, task }) {
      const idx = this.task.findIndex((el) => el.taskId === name);
      if (idx > -1) this.task[idx].task = task;
    },

    addTaskLog({ name, result }) {
      const idx = this.task.findIndex((el) => el.taskId === name);
      if (
        idx > -1 &&
        this.task[idx].state !== "stop" &&
        this.task[idx].state !== "success"
      ) {
        this.task[idx].count++;
        this.task[idx].log.push({
          time: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
          result,
        });
      }
    },

    stopTask([id, message, status = "stop"]) {
      const idx = this.task.findIndex((el) => el.taskId === id);
      if (idx === -1) return;
      const time = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
      this.task[idx].endTime = time;
      this.task[idx].state = status;
      const e = new Event("clearRowInterval");
      e.interval = this.task[idx].interval;
      window.dispatchEvent(e);
      this.task[idx].log.push({
        time,
        result: { status: "stop", info: message },
      });
    },

    setMessage(key, val) {
      this.setting = { ...this.setting, [key]: val };
    },

    initSetting(setting) {
      this.setting = { ...this.setting, ...setting };
    },
  },
  persist: {
    key: "CASO_APP",
    storage: window.localStorage,
    paths: [
      "setting.dialogMessage",
      "setting.serverchanMessage",
      "setting.serverchan_sendkey",
      "setting.startNow",
      "setting.wechatTestMessage",
      "setting.wechat_appId",
      "setting.wechat_appSecret",
      "setting.wechat_templateId",
      "setting.wechat_userId",
      "setting.defaultStore",
      "interval",
    ],
  },
});
