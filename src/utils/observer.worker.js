import { getStock } from "@/data/api";
import { modelDict } from "@/constant";

const timers = new Map();
async function _runTask(
  name,
  useServerChan,
  useDialogMessage,
  useWeChatMessage,
  errorStop,
  interval,
  selectInfo,
  storeInfo
) {
  try {
    const res = await getStock({
      pl: true,
      "parts.0": selectInfo.selectSku,
      location: `${storeInfo.address.stateName} ${storeInfo.address.city}`,
    });

    const payload = res?.data ?? res;

    const body = payload?.content?.pickupMessage;
    const stores = body?.stores;
    if (!Array.isArray(stores)) {
      self.postMessage({
        type: "error",
        intervalTask: null,
        name,
        message: "Invalid response from getStock",
      });
      return;
    }

    const index = stores.findIndex(
      (el) => String(el.storeNumber) === String(storeInfo.id)
    );
    if (index === -1) {
      self.postMessage({
        type: "vuexAddTaskLog",
        name,
        result: { status: "unknown", info: "获取门店信息失败" },
      });
      return;
    }

    const parts = stores[index]?.partsAvailability;
    const p = parts?.[selectInfo.selectSku];
    if (!p) {
      self.postMessage({
        type: "vuexAddTaskLog",
        name,
        result: {
          status: "unknown",
          info: "获取sku信息失败",
        },
      });
      return;
    }

    self.postMessage({
      type: "vuexAddTaskLog",
      name,
      result: { status: p.pickupDisplay, info: p.pickupSearchQuote },
    });

    if (p.pickupDisplay === "available") {
      // 通知主线程停止任务 & 播放音频
      self.postMessage({
        type: "stopTask",
        intervalTask: null,
        name,
        message: "success",
      });
      self.postMessage({ type: "audioMessage" });

      const href = `https://www.apple.com.cn/shop/buy-iphone/${
        modelDict[selectInfo.selectModel]
      }/${selectInfo.selectSku}`;

      // serverChan
      if (useServerChan) {
        self.postMessage({
          type: "serverChan",
          selectInfo,
          storeInfo,
          pickupSearchQuote: p.pickupSearchQuote,
          href,
        });
      }

      // 弹窗
      if (useDialogMessage) {
        self.postMessage({
          type: "dialogMessage",
          title: "有货了!",
          message: `您监控的${selectInfo.selectModel} ${selectInfo.selectColor} ${selectInfo.selectRom}有货啦! 当前状态：${p.pickupSearchQuote}，店铺：${storeInfo.name}，点击立即前往官网购买`,
          href,
        });
      }

      // 微信
      if (useWeChatMessage) {
        self.postMessage({
          type: "wechatMessage",
          selectInfo,
          storeInfo,
          pickupSearchQuote: p.pickupSearchQuote,
          href,
        });
      }

      self.postMessage({
        type: "resolve",
        storeInfo,
        modelInfo: selectInfo,
        pickupDisplay: p.pickupDisplay,
        time: p.pickupSearchQuote,
      });
    }
  } catch (err) {
    console.error(err);
    if (errorStop) {
      self.postMessage({
        type: "error",
        intervalTask: null,
        name,
        message:
          err.name === "AxiosError"
            ? "与苹果官网通信故障，任务暂停！"
            : String(err),
      });
      return;
    }
    self.postMessage({
      type: "vuexAddTaskLog",
      name,
      result: { status: "unknown", info: "与苹果官网通信故障，继续任务！" },
    });
  }
}

function run(
  name,
  useServerChan,
  useDialogMessage,
  useWeChatMessage,
  errorStop,
  interval,
  selectInfo,
  storeInfo,
  now
) {
  const id = setInterval(() => {
    _runTask(
      name,
      useServerChan,
      useDialogMessage,
      useWeChatMessage,
      errorStop,
      interval,
      selectInfo,
      storeInfo
    );
  }, interval * 1000);

  timers.set(name, id);

  self.postMessage({ type: "vuexTaskValue", name, task: null });

  if (now) {
    _runTask(
      name,
      useServerChan,
      useDialogMessage,
      useWeChatMessage,
      errorStop,
      interval,
      selectInfo,
      storeInfo
    );
  }
}

function stopInterval(intervalTask) {
  const id = timers.get(name);
  if (id) {
    clearInterval(intervalTask);
    timers.delete(name);
  }
  // 结束当前 worker
  self.close();
}

self.addEventListener("message", (e) => {
  const data = e.data;
  if (data.type === "beginObserve") {
    run(
      data.name,
      data.useServerChan,
      data.useDialogMessage,
      data.useWechatMessage,
      data.errorStop,
      data.interval,
      data.selectInfo,
      data.storeInfo,
      data.now
    );
  } else {
    stopInterval(data.intervalTask);
  }
});
