const isLocalhost = (h) => ["localhost", "127.0.0.1", "::1"].includes(h);

export function isSecure() {
  return (
    window.isSecureContext ||
    location.protocol === "https:" ||
    isLocalhost(location.hostname)
  );
}

export async function getNotificationStatus() {
  const supported = "Notification" in window;
  const secure = isSecure();

  let permission = "unsupported";
  let permissionState = "unsupported";

  if (supported) {
    permission = Notification.permission;
    permissionState = permission;

    if (navigator.permissions?.query) {
      try {
        const res = await navigator.permissions.query({
          name: "notifications",
        });
        if (res?.state) permissionState = res.state;
      } catch (_) {}
    }
  }

  const ok =
    supported &&
    secure &&
    (permission === "granted" || permissionState === "granted");

  return { supported, secure, permission, permissionState, ok };
}

export function probeNotificationDelivery(timeoutMs = 1800) {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return Promise.resolve({ ok: false, reason: "no_permission" });
  }

  return new Promise((resolve) => {
    try {
      const n = new Notification("通知能力检测", {
        body: "这是一次静默检测，会自动关闭。",
        silent: true,
        tag: "__notify_probe__",
        requireInteraction: false,
      });

      let shown = false;
      const done = (result) => {
        try {
          n.close();
        } catch (_) {}
        resolve(result);
      };

      n.onshow = () => {
        shown = true;
        setTimeout(() => done({ ok: true, reason: "delivered" }), 200);
      };

      setTimeout(() => {
        if (!shown) done({ ok: false, reason: "maybe_blocked" });
      }, timeoutMs);
    } catch (e) {
      resolve({ ok: false, reason: "error", error: String(e) });
    }
  });
}
