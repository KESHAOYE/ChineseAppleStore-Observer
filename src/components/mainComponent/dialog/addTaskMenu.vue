<!--
 * @Author: KESHAOYE
 * @Date: 2022-11-20 23:43:48
-->
<template>
  <el-dialog title="添加任务" :visible.sync="data_visiable" :close-on-click-modal="false" :before-close="closeDialog">
    <el-descriptions title="任务概览" :column="2">
        <el-descriptions-item label="机型信息">{{modelInfo.selectModel}} {{modelInfo.selectRom}} {{modelInfo.selectColor}}</el-descriptions-item>
        <!-- <el-descriptions-item label="SKU信息">{{modelInfo.selectSku}}</el-descriptions-item> -->
        <el-descriptions-item label="商店信息">{{storeInfo.label}}</el-descriptions-item>
        <el-descriptions-item label="间隔时间">{{$store.state.intelval / 1000}}秒</el-descriptions-item>
    </el-descriptions>
    <div class="serverchan_config">
        <el-checkbox v-model="checked">成功时通知我(server酱)</el-checkbox>
      <el-input v-model="sendkey" placeholder="请输入SendKey"  v-if="checked"></el-input>
      <el-link href="https://sct.ftqq.com/" target="_blank" type="danger"  v-if="checked">查看Server酱配置教程</el-link>
    </div>
    <el-button type="primary" @click="add">提交任务</el-button>
  </el-dialog>
</template>

<script>
import {beginObserve,stopTask} from '../../../../utils/observer'
export default {
  data(){
    return {
      sendkey: '',
      checked: false,
      data_visiable: false
    } 
  },
  watch: {
    sendkey(newval) {
      localStorage.setItem('serverchan_sendkey', newval)
    },
    dialogVisible() {
      this.data_visiable = this.dialogVisible
    }
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    modelInfo:  Object,
    storeInfo: Object
  },
  methods: {
    async add() {
      this.closeDialog()
      await beginObserve(this.modelInfo, this.storeInfo, this.checked).then(data=>{
        if(data?.pickupDisplay === 'available') {
          this.$message({
            type: 'success',
            message: `您监听的${data.storeInfo.label} ${data.modelInfo.selectModel} ${data.modelInfo.selectColor} ${data.modelInfo.selectRom},有货啦！当前的状态是${data.time}`,
            duration: 15000,
            showClose: true
          })
          stopTask(data.intelval)
        }
      }).catch(err => {
        console.error(err)
        this.$message.error(err)
      })
    },
    closeDialog() {
      this.$emit('update:dialogVisible',false)
    }
  },
  mounted() {
    this.sendkey = localStorage.getItem('serverchan_sendkey')
  }
}
</script>

<style lang="scss">
 .serverchan_config{
   padding: 10px;
   padding-left: 0;
   margin-bottom: 20px;
 }
</style>