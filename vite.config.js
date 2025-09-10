import { defineConfig } from "vite";
import vue2 from "@vitejs/plugin-vue2";
import path from "node:path";

export default defineConfig({
  plugins: [vue2()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/apis": {
        target: "https://www.apple.com.cn/",
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/apis/, ""),
      },

      "/js/apis": {
        target: "https://www.apple.com.cn/",
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/js\/apis/, ""),
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variable" as *;`,
      },
    },
  },
  build: { sourcemap: false },
});
