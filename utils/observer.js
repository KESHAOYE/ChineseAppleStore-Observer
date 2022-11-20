/*
 * @Author: KESHAOYE
 * @Date: 2022-11-20 15:07:30
 */
// 用于监控货源
import store from './store'
import {
    getStock
} from '../src/data/api'
import {
    nanoid
} from 'nanoid'

/**
 * @Author: KESHAOYE
 * @Date: 2022-11-20 15:42:49
 * @describes: 商城模式监听
 */
export function beginObserve() {
    return new Promise((resolve, reject) => {
        let name = nanoid(),
            arr = {}
        let state = store.state;
        let nowTime = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
        store.commit("addTask", {
            task: null,
            taskId: name,
            beginTime: nowTime,
            endTime: '',
            sku: state.selectSku,
            location: store.getters.location,
            shop: state.selectShop,
            state: '监控中',
            count: 0,
            log: []
        })
        arr[name] = setInterval(async () => getStock({
                pl: true,
                'parts.0': state.selectSku,
                location: store.getters.location
            }).then(
                data => {
                    store.commit('taskValue', {name, task: arr[name]})
                    let body = data.content.pickupMessage
                    let index = body.stores.findIndex(el => el.storeName == state.selectShop)
                    let p = body.stores[index].partsAvailability[state.selectSku]
                    store.commit('addTaskLog', {
                        name,
                        result: {
                            pickupDisplay: p.pickupDisplay,
                            time: p.pickupSearchQuote
                        }
                    })
                    if (p.pickupDisplay == 'available') {
                        console.log(arr[name])
                        stopTask(arr[name])
                        store.commit('stopTask', name)
                        resolve({
                            pickupDisplay: p.pickupDisplay,
                            time: p.pickupSearchQuote
                        })
                    }
                }
            )
            .catch(err => reject(err)), state.intelval)
    })
}

export function stopTask(id) {
    clearInterval(id)
}