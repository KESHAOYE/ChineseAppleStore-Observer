<!--
 * @Author: KESHAOYE
 * @Date: 2022-09-15 01:24:15
-->
<template>
  <div class="submit">
    <div class="info"></div>
    <span class="tips"
      >间隔时间：<span class="gray">监听的间隔时间(秒)</span></span
    >
    <div class="interval">
      <el-input-number
        v-model="interval"
        :step="1"
        controls-position="right"
        :min="5"
        step-strictly
      ></el-input-number>
      <el-checkbox style="margin-left: 20px" v-model="now"
        >任务开始时立即执行</el-checkbox
      >
    </div>
    <div class="buttons">
      <el-button
        type="primary"
        plain
        @click="openAddMenu"
        :disabled="!submitFlag"
        >添加任务</el-button
      >
      <span v-if="isAfterNow(modelInfo.openDate)" class="open_tips"
        >该商品尚未发售，发售时间为：{{ modelInfo.openDate }}</span
      >
    </div>
    <addTaskMenu
      :modelInfo="modelInfo"
      :storeInfo="storeInfo"
      :now="now"
      :interval="interval"
      v-if="submitFlag"
      :dialogVisible.sync="dialogAddTaskVisible"
    ></addTaskMenu>
  </div>
</template>

<script>
import { isAfterNow } from "@/utils/observer";
import addTaskMenu from "../dialog/addTaskMenu.vue";
import { useAppStore } from "@/utils/pinia";

export default {
  name: "submit",
  data() {
    return {
      store: null,
      interval: 5,
      dialogAddTaskVisible: false,
      submitFlag: false,
      now: false,
    };
  },
  props: {
    modelInfo: {
      require: true,
      type: Object,
    },
    storeInfo: {
      require: true,
      type: Object,
    },
  },
  computed: {
    app() {
      return useAppStore();
    },
  },
  watch: {
    "app.interval"(ms) {
      this.interval = (ms || 0) / 1000;
    },
    "app.setting.startNow"(now) {
      this.now = now;
    },
    modelInfo: {
      handler() {
        this.checkArguments();
      },
      deep: true,
    },
    storeInfo: {
      handler() {
        this.checkArguments();
      },
      deep: true,
    },
  },
  components: { addTaskMenu },
  methods: {
    isAfterNow,
    openAddMenu() {
      if (isAfterNow(this.modelInfo.openDate)) {
        this.$message.error("该商品还没到开售时间");
        return;
      }
      if (this.submitFlag) {
        this.dialogAddTaskVisible = true;
      } else {
        this.$message.error("缺少必要参数,请检查");
      }
    },
    checkArguments() {
      this.submitFlag = true;
      for (let i in this.modelInfo)
        if (this.modelInfo[i] == null) {
          this.submitFlag = false;
        }
      for (let i in this.storeInfo)
        if (this.storeInfo[i] == null) {
          this.submitFlag = false;
        }
    },
  },
  mounted() {
    this.interval = (this.app.interval || 0) / 1000;
    this.now = this.app.setting.startNow;
  },
};
</script>

<style lang="scss" scoped>
.submit {
  width: 100%;
  min-width: 0;
  margin: 8px 0 0;
}
.interval {
  font-size: 1.1em;
  font-weight: 600;
}
.buttons {
  margin-top: 16px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.open_tips {
  font-size: 0.8em;
  margin-left: 20px;
  color: rgb(165, 54, 54);
}
</style>
