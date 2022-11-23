<!--
 * @Author: KESHAOYE
 * @Date: 2022-11-23 22:53:34
-->
<template>
  <el-dialog title="任务列表" :visible.sync="data_visiable" :close-on-click-modal="false" :before-close="closeDialog" width="70%">
    <el-table :data="task" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props" style="height: 100px; overflow: auto">
          <div class="log_show" ref="log">
            <span v-for="(log, key) in props.row.log" :key="key">时间:{{log.time}}日志信息:{{log.result}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="型号" width="250">
        <template slot-scope="scope">{{scope.row.shopInfo.selectModel}} {{scope.row.shopInfo.selectColor}} {{scope.row.shopInfo.selectRom}}</template>
      </el-table-column>
      <el-table-column label="城市" width="200">
        <template slot-scope="scope">{{scope.row.storeInfo.province | location(scope.row.storeInfo.city)}}</template>
      </el-table-column>
      <el-table-column label="Apple Store" width="200">
        <template slot-scope="scope">{{scope.row.storeInfo.label}}</template>
      </el-table-column>
      <el-table-column label="运行时长" width="200">
        <template slot-scope="scope">{{scope.row.beginTime | timeCount(scope.row.endTime, scope.row.status)}}</template>
      </el-table-column>
      <el-table-column prop="count" label="监控次数" width="200"></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
export default {
  data(){
    return {
      data_visiable: false
    } 
  },
  computed: {
    ...mapState(['task'])
},
  filters: {
     // 解决直辖市的显示问题
     location(province, city) {
        if(province == city) {
          return `${city}市`
        } else {
          return `${province}省${city}市`
        }
    },
    timeCount(startTime, endTime, status) {
      if(status == 'stop') {
        return moment.utc(new Date(endTime) - new Date(startTime)).format('HH:mm:ss')
      } else {
        return moment.utc(Date.now() - new Date(startTime)).format('HH:mm:ss') 
      }
    }
  },
  watch: {
    dialogVisible() {
      this.data_visiable = this.dialogVisible
    }
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeDialog() {
      this.$emit('update:dialogVisible',false)
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss">
 .log_show{
   height: 200px;
   overflow: scroll;
   span {
    display: block;
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #f2f2f2;
    padding: 2px;
    animation: backgroundChange .8s linear;
   }
 }
 @keyframes backgroundChange {
  0% {
    background: white;
  }
  50%{
    background: #f2f2f2;
  }
  100%{
    background: #fff;
  }
 }
</style>