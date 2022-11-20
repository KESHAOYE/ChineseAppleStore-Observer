/*
 * @Author: KESHAOYE
 * @Date: 2022-09-15 12:20:59
 */
import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex)

const store =  new vuex.Store({
  state:{
    nowProvince: null,
    nowCity: null,
    selectShop: [], // 预留多选店铺
    categoryIndex: -1, // 当前品类
    selectTypeId: -1, // 选择机型系列
    selectRom: null,
    selectModel: null,
    selectColor: null,
    selectSku: null,
    canGetStore:false,
    intelval: 10000,
    task:[],
  },
  mutations: {
    // 初始化
    init(state) {
      state.selectShop = [] // 预留多选店铺
      state.selectRom = null
      state.selectModel = null
      state.selectColor = null
      state.selectSku = null
      state.nowCity = null
    },
    changeNowProvince(state, n) {
      state.nowProvince = n
    },
    changeNowCity(state, n) {
      state.nowCity = n
    },
    changeCategoryIndex(state, n) {
      state.categoryIndex = n
    },
    changeSelectTypeId(state, n) {
      state.selectTypeId = n
    },
    changeChooseInfo(state, kv) {
      for(let i in kv ) {
        state[i] = kv[i]
      }
    },
    changeIntelval(state, t) {
      state.intelval = t
    },
    changeSelectShop(state, n) {
      state.selectShop = n
    },
    changeCanGetStore(state, t) {
      state.canGetStore = t
    },
    addTask(state, config) {
      state.task.push(config)
    },
    taskValue(state, task) {
      let index = state.task.findIndex(el=>el.taskId==task.name)
      state.task[index].task = task.task
    },
    addTaskLog(state, result) {
      let index = state.task.findIndex(el=>el.taskId==result.name)
      state.task[index].count++
      state.task[index].log.push({time: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, result: result.result})
    },
    stopTask(state, id) {
      let index = state.task.findIndex(el=>el.taskId==id)
      let time = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
      state.task[index].endTime = time
      state.task[index].state = '已停止'
      state.task[index].log.push({time, result:'任务已完成'})
    }
  },
  getters: {
    location(state) {
      return `${state.nowProvince} ${state.nowCity}`
    },
    selectInfo(state) {
      return {
        selectModel: `${state.selectModel} ${state.selectRom} ${state.selectColor}`,
        selectSku:state.selectSku,
        selectShop:`${state.nowProvince} ${state.nowCity} APPLE ${state.selectShop}`,
        intelval: state.intelval
      }
    }
  }
})

store.subscribe((m, s)=> {
  let tag = false
  let disableUpdateList = ['selectShop','changeCanGetStore','changeNowProvince', 'changeIntelval', 'changeSelectShop','addTask','addTaskLog','stopTask','taskValue']
    if(disableUpdateList.includes(m.type)) {
      tag = true
    }        
  // 城市和SKU均选择且更新项目不为店铺时
  if(s.nowCity != null && s.selectSku != null && !tag) {
    tag = false
    s.canGetStore = Math.random()
  }
})

export default store;