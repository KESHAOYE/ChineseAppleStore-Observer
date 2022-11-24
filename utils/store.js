/*
 * @Author: KESHAOYE
 * @Date: 2022-09-15 12:20:59
 */
import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex)

const store =  new vuex.Store({
  state:{
    categoryIndex: -1, // 当前品类
    selectTypeId: -1, // 选择机型系列
    intelval: 5000,
    task:[],
  },
  mutations: {
    // 初始化
    init(state) {
      state.selectShop = null // 预留多选店铺
      state.nowCity = null
    },
    changeCategoryIndex(state, n) {
      state.categoryIndex = n
    },
    changeSelectTypeId(state, n) {
      state.selectTypeId = n
    },
    changeIntelval(state, t) {
      state.intelval = t
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
    stopTask(state, [id, message, status = 'stop']) {
      let index = state.task.findIndex(el=>el.taskId==id)
      let time = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
      state.task[index].endTime = time
      state.task[index].state = status
      state.task[index].log.push({time, result: {
        status: 'stop',
        info:message}})
    }
  },
  getters: {
    isExistTask(state) {
      return (sku, storeId)=> {
        var tag = true
        state.task.map(task=>{
          if(task.shopInfo.selectSku == sku && task.storeInfo.id == storeId && task.state!='stop' && task.state!='success') {
            tag = false
          }
        })
        return tag
      }
    },
    taskCount(state) {
      return state.task.filter(e=>e.state == 'observering').length
    }
  }
})

export default store;