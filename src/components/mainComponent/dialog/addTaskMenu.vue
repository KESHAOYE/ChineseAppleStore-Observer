<!--
 * @Author: KESHAOYE
 * @Date: 2022-11-20 23:43:48
-->
<template>
  <el-dialog title="添加任务" :visible.sync="dialogVisible">
    <el-descriptions title="任务概览">
        <el-descriptions-item label="机型信息">{{selectInfo.selectModel}}</el-descriptions-item>
        <!-- <el-descriptions-item label="SKU信息">{{selectInfo.selectSku}}</el-descriptions-item> -->
        <el-descriptions-item label="商店信息">{{selectInfo.selectShop}}</el-descriptions-item>
        <el-descriptions-item label="间隔时间">{{selectInfo.intelval / 1000}}秒</el-descriptions-item>
    </el-descriptions>
    <div class="serverchan_config">
        <el-checkbox v-model="checked">成功时通过微信通知我(server酱)</el-checkbox>
      <el-input v-model="sendkey" placeholder="请输入SendKey"  v-if="checked"></el-input>
      <el-link href="https://sct.ftqq.com/" type="danger"  v-if="checked">查看Server酱配置教程</el-link>
    </div>
    <el-button type="primary">提交任务</el-button>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data(){
    return {
      sendkey: '',
      checked: false
    } 
  },
  computed: {
    ...mapGetters(['selectInfo'])
  },
  watch: {
    sendkey(newval) {
      localStorage.setItem('serverchan_sendkey', newval)
    }
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.name = localStorage.getItem('serverchan_sendkey')
  }
}
</script>

<style lang="scss">
 .serverchan_config{
   padding: 10px;
 }
</style>