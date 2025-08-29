<!--
 * @Author: KESHAOYE
 * @Date: 2022-11-26 20:36:13
-->
<template>
  <div class="settings">
    <div class="setting_item">
      <div class="tips">
        <div class="content">任务间隔时长</div>
        <div class="descript">默认监听触发时长</div>
      </div>
      <el-input-number
        size="mini"
        v-model="interval"
        :min="5"
      ></el-input-number>
    </div>
    <div class="setting_item">
      <div class="tips">
        <div class="content">立即开始监听</div>
        <div class="descript">开始任务后马上执行监听</div>
      </div>
      <el-switch
        v-model="startNow"
        active-text="是"
        inactive-text="否"
      ></el-switch>
    </div>
    <!-- <div class="setting_item">
      <div class="tips">模式</div>
      <el-select v-model="mode" size="mini" placeholder="请选择模式">
        <el-option key="shop" label="商店模式(仅支持iPhone)" value="shop"></el-option>
        <el-option key="multiple" label="多选模式" value="multiple"></el-option>
      </el-select>
    </div> -->
  </div>
</template>

<script>
import { useAppStore } from "@/utils/pinia";

export default {
  name: "SettingsInterval",
  data() {
    return {
      mode: "shop",
    };
  },
  computed: {
    app() {
      return useAppStore();
    },
    interval: {
      get() {
        return Math.floor((this.app.interval || 0) / 1000);
      },
      set(val) {
        const ms = Number(val) * 1000;
        this.app.changeInterval(ms);
        // localStorage.setItem("interval", ms);
      },
    },
    startNow: {
      get() {
        return this.app.setting.startNow;
      },
      set(val) {
        this.app.changeStartNow(val);
        // localStorage.setItem("startNow", val);
      },
    },
  },
};
</script>

<style></style>
