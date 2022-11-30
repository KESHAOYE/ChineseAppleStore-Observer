<!--
 * @Author: KESHAOYE
 * @Date: 2022-11-28 13:16:59
-->
<template>
  <div class="settings">
    <div class="setting_item">
      <div class="tips">
        <div class="content">版本信息</div>
        <div class="descript">当前版本号</div>
      </div>
      <el-tag>{{version}}</el-tag>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    version() {
      return this.$store.state.version
    }
  }
}
</script>

<style>

</style>