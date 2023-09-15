/*
 * @Author: KESHAOYE
 * @Date: 2022-11-20 15:07:30
 */
// 用于监控货源
import store from './store'
import {
    sendServerChan
} from '../src/data/api'
import {
    nanoid
} from 'nanoid'
import Vue from 'vue'
import { MAX_TASK_LIST,} from '../src/constant'
import observerWorker from './observer.worker'

/**
 * @Author: KESHAOYE
 * @Date: 2022-11-20 15:42:49
 * @describes: 商城模式监听
 */

let worker = null

export function beginObserve(selectInfo, storeInfo, useServerChan, interval) {
    return new Promise((resolve, reject) => {
        let name = nanoid()
        let nowTime = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
        let state = store.state
        // 判断同商店是否有相同任务在运行
        if (!store.getters.isExistTask(selectInfo.selectSku, storeInfo.id)) {
            reject('该任务正在运行中,请不要重复添加')
            return
        }
        if(store.getters.taskCount >= MAX_TASK_LIST) {
            reject(`当前已达任务上限,请终止部分任务后继续(任务上限制为${MAX_TASK_LIST})`)
            return
        }
        Vue.prototype.$message.success('开始监控啦!')
        if(state.setting.dialogMessage) {
          dialogMessage('开始监控啦', '请不要关闭页面，可将页面放至后台运行')
        }
        store.commit("addTask", {
            task: null,
            taskId: name,
            intervalTime: '00:00:00',
            interval: null,
            beginTime: nowTime,
            endTime: '',
            location: `${storeInfo.address.stateName} ${storeInfo.address.city}`,
            storeInfo: storeInfo,
            shopInfo: selectInfo,
            state: 'observering',
            count: 0,
            log: []
        })
        worker = new observerWorker({
            type: 'module'
        })
        worker.postMessage({
            type: 'beginObserve',
            name, 
            useServerChan,
            useDialogMessage: state.setting.dialogMessage, 
            interval,
            selectInfo,
            storeInfo
        })
        worker.onmessage = (event) => {
          const data = event.data
          switch(data.type) {
            // 操作vuex
            case 'vuexTaskValue': 
                store.commit('taskValue', {
                    name: data.name,
                    task: data.task
                })
                break;
            case 'vuexAddTaskLog':
                store.commit('addTaskLog', {
                    name: data.name,
                    result: data.result
                })
                break;
            case 'stopTask':
                stopTask(data.intervalTask, data.name, data.message)
                break;
            case 'audioMessage':
                audioMessage()
                break;
            case 'serverChan':
                sendMessage(selectInfo, storeInfo, data.pickupSearchQuote)
                break;
            case 'dialogMessage':
                dialogMessage(data.title, data.message, data.href)
                break;
            case 'resolve':
                resolve({
                  storeInfo: storeInfo,
                  modelInfo: selectInfo,
                  pickupDisplay: data.pickupDisplay,
                  time: data.time
                })
                break;
            default: console.error(`未捕获事件${data.type}`);
          }
        }
    })
}

// 微信接口号
function wechatJKMessage(){}

function sendMessage(selectInfo, storeInfo, pickupSearchQuote) {
    let sendkey = localStorage.getItem('serverchan_sendkey')
    sendServerChan({
        sendkey,
        title: '您监控的商品有货啦!!',
        content: `您监控的${selectInfo.selectModel} ${selectInfo.selectColor} ${selectInfo.selectRom}有货啦!当前状态为：${pickupSearchQuote},店铺为：${storeInfo.name}`
    }).then(data => {
        console.log(`${data}`)
    }).catch(err=>{
        Vue.prototype.$message.error(`server酱发生错误，${err.response.data.message}，请检查`)
    })
}

function audioMessage() {
    let url = require('../src/assets/message.mp3')
    let player = new Audio(url)
    player.play()
}

function dialogMessage(title, message, href) {
    var Notification = window.Notification || window.mozNotification || window.webkitNotification;
    if(Notification){
        Notification.requestPermission(function(status){
            //status默认值'default'等同于拒绝 'denied' 意味着用户不想要通知 'granted' 意味着用户同意启用通知
            if("granted" != status){
                Vue.prototype.$message.error('用户拒绝弹窗')
                localStorage.setItem('setting', JSON.stringify({
                    ...JSON.parse(localStorage.getItem('setting')),
                    dialogMessage: false
                  }))
                store.commit('setMessage', ['dialogMessage', false])
                return;
            }else{
                var notify = new Notification( title, {
                    dir:'auto',
                    lang:'zh-CN',
                    requireInteraction: true,
                    body:message //通知的具体内容
                })
                notify.onclick=function(){
                    notify.close();
                    if(href) {
                      window.open(href)
                    }
                }
            }
        })
    }
}

export function stopTask(task, taskId, status, message='任务已完成,自动结束') {
    let index = store.state.task.findIndex(el=>el.taskId==taskId)
    if(store.state.task[index].count > 0) {
      store.commit('stopTask', [taskId, message, status])
      worker.postMessage({
        type: 'stop',
        intervalTask: task
    })
    } else {
        Vue.prototype.$message.error('暂不能取消')
    }
}