import { getStock } from "@/data/api";
import { modelDict } from "@/constant";

async function _runTask(
  name,
  useServerChan,
  useDialogMessage,
  useWeChatMessage,
  interval,
  selectInfo,
  storeInfo,
  arr
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
        intervalTask: arr[name],
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
        result: { status: "unknown", info: "store not found in response" },
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
          info: "sku not found in partsAvailability",
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
        intervalTask: arr[name],
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
    self.postMessage({ type: "error", name, message: String(err) });
  }
}

function run(
  name,
  useServerChan,
  useDialogMessage,
  useWeChatMessage,
  interval,
  selectInfo,
  storeInfo,
  now
) {
  console.log(useWeChatMessage);
  const arr = {};
  arr[name] = setInterval(() => {
    _runTask(
      name,
      useServerChan,
      useDialogMessage,
      useWeChatMessage,
      interval,
      selectInfo,
      storeInfo,
      arr
    );
  }, interval * 1000);

  self.postMessage({ type: "vuexTaskValue", name, task: arr[name] });

  if (now) {
    _runTask(
      name,
      useServerChan,
      useDialogMessage,
      useWeChatMessage,
      interval,
      selectInfo,
      storeInfo,
      arr
    );
  }
}

function stopInterval(intervalTask) {
  clearInterval(intervalTask);
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
      data.interval,
      data.selectInfo,
      data.storeInfo,
      data.now
    );
  } else {
    stopInterval(data.intervalTask);
  }
});
