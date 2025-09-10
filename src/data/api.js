import api from "@/utils/request.js";
import localStores from "./applestore.json";

/** 库存查询 */
export function getStock(params) {
  return api.get("/shop/fulfillment-messages", { params });
}

/** 地区/地址查询 */
export function getProvide() {
  return api.get("/shop/address-lookup");
}

function normalizeStorePayload(raw) {
  if (!raw) return null;

  if (Array.isArray(raw.storeListData)) return raw;

  const states = raw.state || raw.states;
  if (Array.isArray(states)) {
    const normStates = states.map((s) => ({
      name: s.name || s.stateName || "其他地区",
      store: (s.store || s.stores || [])
        .map((x) => ({
          id: String(x.id || x.storeNumber || x.storeId || ""),
          name: x.name || x.storeName || "",
          slug: x.slug || x.storeSlug || x.retailStoreSlug || "",
        }))
        .filter((x) => x.id && x.name),
    }));
    return { storeListData: [{ state: normStates }] };
  }

  return null;
}

/** Server酱推送 */
export function sendServerChan({ sendkey, title, content }) {
  return api.get(`https://sctapi.ftqq.com/${sendkey}.send`, {
    params: { title, desp: content },
  });
}
