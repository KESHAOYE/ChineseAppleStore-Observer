<!-- src/App.vue -->
<template>
  <div id="app">
    <a-header></a-header>
    <a-main></a-main>
    <a-foot></a-foot>
  </div>
</template>

<script>
import { useAppStore } from "@/utils/pinia.js";

import aHeader from "./components/header/index.vue";
import aMain from "./components/shopMode/index.vue";
import aFoot from "./components/footer/index.vue";

export default {
  name: "App",
  components: { aMain, aHeader, aFoot },

  beforeCreate() {
    const app = useAppStore();

    const rawSetting = localStorage.getItem("setting");
    if (rawSetting) {
      app.initSetting(JSON.parse(rawSetting));
    }

    const rawInterval = localStorage.getItem("interval");
    if (rawInterval) {
      app.changeInterval(Number(rawInterval));
    }
  },

  methods: {
    unload(e) {
      e.preventDefault();
      e.returnValue = "";
    },
  },

  mounted() {
    window.addEventListener("beforeunload", this.unload);
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload", this.unload);
  },
};
</script>

<style lang="scss">
@font-face {
  font-family: misans;
  src: url("./assets/font/MiSans-Normal.ttf");
}
* {
  font-family: misans;
  user-select: none;
}

.tips {
  font-weight: bolder;
  font-size: 1.3em;
  display: block;
  margin: 25px 0;
  margin-top: 60px;

  .gray {
    color: rgb(94, 94, 94);
    font-weight: lighter;
  }
}

#app {
  min-width: 1024px;
}
</style>
