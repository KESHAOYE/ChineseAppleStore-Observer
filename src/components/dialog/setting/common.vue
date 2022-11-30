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
      <el-input-number size="mini" v-model="interval" :min="5"></el-input-number>
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
export default {
  data() {
    return {
      mode: 'shop'
    }
  },
  computed: {
    interval: {
      get() {
        return this.$store.state.interval / 1000
      },
      set(val) {
        this.$store.commit('changeInterval', val * 1000)
        localStorage.setItem('interval', val * 1000)
      }
    }
  }
}
</script>

<style>

</style>