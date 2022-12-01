/*
 * @Author: KESHAOYE
 * @Date: 2022-11-20 15:07:30
 */
// 用于监控货源
import store from './store'
import {
    getStock,
    sendServerChan
} from '../src/data/api'
import {
    nanoid
} from 'nanoid'
import Vue from 'vue'
import { MAX_TASK_LIST,modelDict } from '../src/constant'

/**
 * @Author: KESHAOYE
 * @Date: 2022-11-20 15:42:49
 * @describes: 商城模式监听
 */
export function beginObserve(selectInfo, storeInfo, useServerChan, interval) {
    return new Promise((resolve, reject) => {
        let name = nanoid(),
            arr = {}
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
            beginTime: nowTime,
            endTime: '',
            location: `${storeInfo.province} ${storeInfo.city}`,
            storeInfo: storeInfo,
            shopInfo: selectInfo,
            state: 'observering',
            count: 0,
            log: []
        })
        arr[name] = setInterval(async () => {
            store.commit('taskValue', {
                name,
                task: arr[name]
            })
            await getStock({
                pl: true,
                'parts.0': selectInfo.selectSku,
                location: `${storeInfo.province} ${storeInfo.city}`
            }).then(
                data => {
                    let body = data.content.pickupMessage
                    let index = body.stores.findIndex(el => el.storeNumber == storeInfo.id)
                    let p = body.stores[index].partsAvailability[selectInfo.selectSku]
                    store.commit('addTaskLog', {
                        name,
                        result: {
                            status: p.pickupDisplay,
                            info: p.pickupSearchQuote
                        }
                    })
                    if (p.pickupDisplay == 'available') {
                        stopTask(arr[name], name, 'success')
                        audioMessage()
                        if (useServerChan) {
                            sendMessage(selectInfo, storeInfo, p.pickupSearchQuote)
                        }
                        if(state.setting.dialogMessage) {
                            let href = `https://www.apple.com.cn/shop/buy-iphone/${modelDict[selectInfo.selectModel]}/${selectInfo.selectSku}`
                            dialogMessage('有货了!', `您监控的${selectInfo.selectModel} ${selectInfo.selectColor} ${selectInfo.selectRom}有货啦!当前状态为：${p.pickupSearchQuote},店铺为：${storeInfo.label},点击立即前往官网购买`, href)
                          }
                        resolve({
                            storeInfo: storeInfo,
                            modelInfo: selectInfo,
                            pickupDisplay: p.pickupDisplay,
                            time: p.pickupSearchQuote
                        })
                    }
                }
            )
        }, interval * 1000)
    })
}

function sendMessage(selectInfo, storeInfo, pickupSearchQuote) {
    let sendkey = localStorage.getItem('serverchan_sendkey')
    sendServerChan({
        sendkey,
        title: '您监控的商品有货啦!!',
        content: `您监控的${selectInfo.selectModel} ${selectInfo.selectColor} ${selectInfo.selectRom}有货啦!当前状态为：${pickupSearchQuote},店铺为：${storeInfo.label}`
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
      clearInterval(task)
    } else {
      this.$message.error('暂不能取消')
    }
}