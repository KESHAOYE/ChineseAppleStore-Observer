import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env?.VITE_API_BASE || "/apis",
  timeout: 10000,
  headers: { "X-Requested-With": "XMLHttpRequest" },
});

api.interceptors.request.use(
  (config) => config,
  (err) => Promise.reject(err)
);

api.interceptors.response.use(
  (res) => {
    const ct = (res.headers && res.headers["content-type"]) || "";
    let data = res.data;

    if (typeof data === "string") {
      const s = data.trim();
      if (
        ct.includes("text/html") ||
        s.startsWith("<!DOCTYPE") ||
        s.startsWith("<html")
      ) {
        const url = (res.config?.baseURL || "") + (res.config?.url || "");
        throw new Error(
          `Expected JSON but got HTML from ${url}. Check VITE_API_BASE/proxy.`
        );
      }

      if (s.startsWith("{") || s.startsWith("[")) {
        try {
          data = JSON.parse(s);
        } catch {}
      }
    }

    if (data && typeof data === "object" && "body" in data) {
      return data.body;
    }
    return data;
  },
  (err) => {
    if (err?.response) {
      const { status, statusText, config } = err.response;
      err.message = `HTTP ${status} ${statusText} for ${config?.url}`;
    }
    return Promise.reject(err);
  }
);

export default api;
