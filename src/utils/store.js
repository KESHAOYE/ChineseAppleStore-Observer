/*
 * @Author: KESHAOYE
 * @Date: 2022-09-15 12:20:59
 */
import Vue from "vue";
import vuex from "vuex";

Vue.use(vuex);

const store = new vuex.Store({
  state: {
    model: {
      skus: [],
      roms: [],
      models: [],
    },
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
      // sendkey_check: false
    },
    version: "1.2.0 ALPHA",
  },
  mutations: {
    // 初始化
    changeCategoryIndex(state, n) {
      state.categoryIndex = n;
    },
    changeSelectTypeId(state, n) {
      state.selectTypeId = n;
    },
    changeInterval(state, t) {
      state.interval = t;
    },
    // 添加表格计时器
    changeTaskInterval(state, [index, interval]) {
      state.task[index].interval = interval;
    },
    addTask(state, config) {
      const event = new Event("addTask");
      event.taskId = config.taskId;
      state.task.push(config);
      window.dispatchEvent(event);
    },
    changeNowImage(state, val) {
      state.nowImage = val;
    },
    changeModel(state, [key, value, isClear]) {
      if (isClear) {
        state.model[key] = [];
      } else {
        state.model[key].push(value);
      }
    },
    changeVersion(state, val) {
      state.version = val;
    },
    taskValue(state, task) {
      let index = state.task.findIndex((el) => el.taskId == task.name);
      state.task[index].task = task.task;
    },
    addTaskLog(state, result) {
      let index = state.task.findIndex((el) => el.taskId == result.name);
      if (
        state.task[index].state != "stop" &&
        state.task[index].state != "success"
      ) {
        state.task[index].count++;
        state.task[index].log.push({
          time: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
          result: result.result,
        });
      }
    },
    stopTask(state, [id, message, status = "stop"]) {
      let index = state.task.findIndex((el) => el.taskId == id);
      let time = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
      state.task[index].endTime = time;
      state.task[index].state = status;
      const e = new Event("clearRowInterval");
      e.interval = state.task[index].interval;
      window.dispatchEvent(e);
      state.task[index].log.push({
        time,
        result: {
          status: "stop",
          info: message,
        },
      });
    },
    setMessage(state, [key, val]) {
      state.setting[key] = val;
    },
    initSetting(state, setting) {
      state.setting = setting;
    },
  },
  getters: {
    isExistTask(state) {
      return (sku, storeId) => {
        var tag = true;
        state.task.map((task) => {
          if (
            task.shopInfo.selectSku == sku &&
            task.storeInfo.id == storeId &&
            task.state != "stop" &&
            task.state != "success"
          ) {
            tag = false;
          }
        });
        return tag;
      };
    },
    taskCount(state) {
      return state.task.filter((e) => e.state == "observering").length;
    },
  },
});

export default store;
