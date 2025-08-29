<!-- src/components/header/index.vue -->
<template>
  <header>
    <!--状态环-->
    <div class="logo">
      <div class="status_ring"></div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        enable-background="new 0 0 14 44"
        height="60"
        viewBox="0 0 14 44"
        width="60"
      >
        <path d="m0 0h14v44h-14z" fill="none" />
        <path
          d="m13.0729 17.5214c-.093.0723-1.7248.9915-1.7248 3.0364 0 2.3651 2.0759 3.2017 2.1379 3.2223-.0103.0516-.3305 1.1464-1.0948 2.2618-.6816.9812-1.3943 1.9623-2.4787 1.9623s-1.3633-.63-2.613-.63c-1.2187 0-1.6525.6507-2.644.6507s-1.6835-.9089-2.4787-2.0243c-.9192-1.3117-1.6628-3.3463-1.6628-5.2776 0-3.0984 2.014-4.7406 3.9969-4.7406 1.0535 0 1.9313.692 2.5923.692.63 0 1.6112-.7333 2.8092-.7333.4545.0001 2.0864.0415 3.1605 1.5803zm-3.7284-2.8918c.4957-.5887.8469-1.4046.8469-2.2205 0-.1136-.0103-.2272-.031-.3202-.8056.031-1.7661.5371-2.3445 1.2084-.4544.5164-.8779 1.3323-.8779 2.1586 0 .1239.0207.2479.031.2892.0516.0103.1343.0207.2169.0207.723-.0001 1.6318-.4855 2.1586-1.1362z"
          fill="#000"
        />
      </svg>
    </div>
    <!--工具栏-->
    <div class="toolTip">
      <div class="item useless">切换模式</div>
      <div class="item" @click="openSetting">项目设置</div>
      <div class="item" @click="openTaskList">
        <el-badge :value="taskCount">任务列表</el-badge>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState } from "pinia";
import { useAppStore } from "@/utils/pinia.js";

export default {
  name: "HeaderBar",
  computed: {
    ...mapState(useAppStore, ["taskCount"]),
  },
  methods: {
    openTaskList() {
      this.$EventBus.$emit("toggleTaskList", true);
    },
    openSetting() {
      this.$EventBus.$emit("toggleSetting", true);
    },
  },
};
</script>

<style lang="scss" scoped>
@keyframes low_ring {
}
@keyframes middle_ring {
}
@keyframes high_ring {
}

header {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  height: 60px;

  .logo {
    width: 60%;
    height: 60px;

    .status_ring {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 6px solid #000;
      position: absolute;
      z-index: -1;
      display: none;
    }
  }

  .toolTip {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    align-items: center;
    min-width: 200px;
    height: 60px;

    .item {
      width: 100px;
      height: 60px;
      line-height: 60px;
      font-size: 14px;
      color: #606266;
      cursor: pointer;

      &:hover {
        color: rgb(53, 147, 255);
      }
    }

    .useless {
      color: #d2d2d2;
      cursor: not-allowed;

      &:hover {
        color: #d2d2d2 !important;
      }
    }
  }
}
</style>
