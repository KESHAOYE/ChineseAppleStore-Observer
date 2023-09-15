const { getStock } = require('../src/data/api')
const { modelDict } = require('../src/constant')
function run(name, useServerChan, useDialogMessage, interval, selectInfo, storeInfo) {
   let arr = {}
   arr[name] = setInterval(async () => {
        self.postMessage({
          type: 'vuexTaskValue',
          name,
          task: arr[name]
        })
        // stores.commit('taskValue', {
        //     name,
        //     task: i
        // })
        await getStock({
            pl: true,
            'parts.0': selectInfo.selectSku,
            location: `${storeInfo.address.stateName} ${storeInfo.address.city}`
        }).then(
            data => {
                let body = data.content.pickupMessage
                let index = body.stores.findIndex(el => el.storeNumber == storeInfo.id)
                let p = body.stores[index].partsAvailability[selectInfo.selectSku]
                self.postMessage({
                    type: 'vuexAddTaskLog',
                    name,
                    result: {
                        status: p.pickupDisplay,
                        info: p.pickupSearchQuote
                    }
                  })
                // stores.commit('addTaskLog', {
                //     name,
                //     result: {
                //         status: p.pickupDisplay,
                //         info: p.pickupSearchQuote
                //     }
                // })
                if (p.pickupDisplay == 'available') {
                    self.postMessage({
                        type: 'stopTask',
                        intervalTask: arr[name], 
                        name, 
                        message: 'success'
                    })
                    // stopTask(arr[name], name, 'success')
                    self.postMessage({type: 'audioMessage'})
                    //audioMessage()
                    if (useServerChan) {
                        self.postMessage({
                          type: 'serverChan',
                          selectInfo, 
                          storeInfo, 
                          pickupSearchQuote: p.pickupSearchQuote
                        })
                    }
                    if(useDialogMessage) {
                        let href = `https://www.apple.com.cn/shop/buy-iphone/${modelDict[selectInfo.selectModel]}/${selectInfo.selectSku}`
                        self.postMessage({
                          type: 'dialogMessage',
                          title: '有货了!', 
                          message: `您监控的${selectInfo.selectModel} ${selectInfo.selectColor} ${selectInfo.selectRom}有货啦!当前状态为：${p.pickupSearchQuote},店铺为：${storeInfo.name},点击立即前往官网购买`, 
                          href
                        })
                      }
                      self.postMessage({
                        type: 'resolve',
                        storeInfo: storeInfo,
                        modelInfo: selectInfo,
                        pickupDisplay: p.pickupDisplay,
                        time: p.pickupSearchQuote
                    })
                    // resolve({
                    //     storeInfo: storeInfo,
                    //     modelInfo: selectInfo,
                    //     pickupDisplay: p.pickupDisplay,
                    //     time: p.pickupSearchQuote
                    // })
                }
            }
        )
    }, interval * 1000)
}

function stopInterval(intervalTask) {
  clearInterval(intervalTask)
  console.log('结束定时任务' + intervalTask);
  self.close()
}

self.addEventListener('message',function(e) {
   const data = e.data
   if(data.type == 'beginObserve') {
     run(data.name, data.useServerChan, data.useDialogMessage, data.interval, data.selectInfo, data.storeInfo)
   } else {
    stopInterval(data.intervalTask)
   }
})