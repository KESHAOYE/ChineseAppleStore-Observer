import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";
// import store from "@/utils/store";
import { createPinia, PiniaVuePlugin } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

Vue.use(PiniaVuePlugin);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

Vue.prototype.$EventBus = new Vue();
Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
  pinia,
  render: (h) => h(App),
}).$mount("#app");
