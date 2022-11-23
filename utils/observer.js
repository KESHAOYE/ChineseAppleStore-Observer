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
import { MAX_TASK_LIST } from '../src/constant'

/**
 * @Author: KESHAOYE
 * @Date: 2022-11-20 15:42:49
 * @describes: 商城模式监听
 */
export function beginObserve(selectInfo, storeInfo, useServerChan) {
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
            reject('当前已达任务上限,请终止部分任务后继续')
            return
        }
        Vue.prototype.$message.success('开始监控啦!')
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
                        status: 'observering',
                        result: {
                            pickupDisplay: p.pickupDisplay,
                            time: p.pickupSearchQuote
                        }
                    })
                    if (p.pickupDisplay == 'available') {
                        stopTask(arr[name])
                        store.commit('stopTask', name)
                        audioMessage()
                        if (useServerChan) {
                            sendMessage(selectInfo, storeInfo, p.pickupSearchQuote)
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
        }, state.intelval)
    })
}


function sendMessage(selectInfo, modelInfo, pickupSearchQuote) {
    let sendkey = localStorage.getItem('serverchan_sendkey')
    sendServerChan({
        sendkey,
        title: '您监控的商品有货啦!!',
        content: `您监控的${modelInfo.label} ${selectInfo.selectModel}当前状态为${pickupSearchQuote}`
    }).then(data => {
        console.log(data)
    })
}

function audioMessage() {
    let url = require('../src/assets/message.mp3')
    let player = new Audio(url)
    player.play()
}

export function stopTask(id) {
    clearInterval(id)
}