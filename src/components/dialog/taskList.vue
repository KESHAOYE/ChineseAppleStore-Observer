<!--
 * @Author: KESHAOYE
 * @Date: 2022-11-23 22:53:34
-->
<template>
  <el-dialog title="任务列表" :visible.sync="data_visiable" :close-on-click-modal="false" :before-close="closeDialog" width="95%">
    <el-table :data="task" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <div class="log_show" :ref="props.row.taskId">
            <div class="log_item" v-for="(log, key) in props.row.log" :key="key">
               <div class="status"><i :class="iconDict[log.result.status]"></i></div>
               <div class="info">
                  <div class="time">{{log.time}}</div>
                  <div class="result" v-if="log.result.status == 'available' || log.result.status == 'unavailable'">{{log.result.info | result(log.result.status)}}</div>
                  <div class="result" v-else>信息: {{log.result.info}}</div>
               </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">{{scope.row.state | status}}</template>
      </el-table-column>
      <el-table-column label="型号" width="230">
        <template slot-scope="scope">{{scope.row.shopInfo.selectModel}} {{scope.row.shopInfo.selectColor}} {{scope.row.shopInfo.selectRom}}</template>
      </el-table-column>
      <el-table-column label="城市" width="180">
        <template slot-scope="scope">{{scope.row.storeInfo.province | location(scope.row.storeInfo.city)}}</template>
      </el-table-column>
      <el-table-column label="Apple Store" width="180">
        <template slot-scope="scope">{{scope.row.storeInfo.label}}</template>
      </el-table-column>
      <el-table-column label="运行时长" width="180">
        <template slot-scope="scope">{{scope.row.beginTime | timeCount(scope.row.endTime, scope.row.state)}}</template>
      </el-table-column>
      <el-table-column prop="count" label="监控次数" width="150"></el-table-column>
      <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button type="success" size="mini" @click="buy(scope.row)" v-if="scope.row.state == 'success'">有货,前往购买</el-button>
        <el-popconfirm title="确认结束此任务吗？" @confirm="stopTasks(scope.row.task, scope.row.taskId)" v-if="scope.row.state!='stop'&& scope.row.state!='success'">
          <el-button type="danger" slot="reference" size="mini">结束任务</el-button>
        </el-popconfirm>
      </template>
    </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import { stopTask } from '@/../utils/observer'
import {modelDict, status} from '@/constant/index'
export default {
  data(){
    return {
      data_visiable: false,
      iconDict: {
        'available': 'el-icon-success success',
        'unavailable': 'el-icon-error error',
        'stop': 'el-icon-remove stop'
      }
    } 
  },
  computed: {
    ...mapState(['task','interval'])
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
      if(status == 'stop' || status == 'success') {
        return moment.utc(new Date(endTime) - new Date(startTime)).format('HH:mm:ss')
      } else {
        return moment.utc(Date.now() - new Date(startTime)).format('HH:mm:ss') 
      }
    },
    status(s) {
      return status[s]
    },
    result(result, status) {
      return status == 'available' ? `有货,当前状态为${result}` : `当前暂无货供应`
    }
  },
  watch: {
    task: {
      deep: true,
      handler() {
        this.$nextTick(()=>{
          this.task.map(task=>{
            if(this.$refs[task.taskId]) {
              this.$refs[task.taskId].scrollTo(0, task.log.length * 60)
            }
          })
        })
      }
    }
  },
  methods: {
    closeDialog() {
      this.data_visiable = false
    },
    stopTasks(task, taskId) {
      stopTask(task, taskId, 'stop' , '用户已手动终止任务')
    },
    buy(info) {
      this.$notify({
          title: '警告',
          message: '即将前往Apple官网,请仔细核对后下单~',
          type: 'warning',
          duration: 1500
        })
      setTimeout(()=>{
        window.open(`https://www.apple.com.cn/shop/buy-iphone/${modelDict[info.shopInfo.selectModel]}/${info.shopInfo.selectSku}`)
      }, 1000)
    },
  },
  mounted() {
    this.$EventBus.$on('toggleTaskList', (state)=>{
      this.data_visiable = state
    })
  }
}
</script>

<style lang="scss">
 .log_show{
   height: 200px;
   overflow-y: auto;
   .log_item {
    height: 60px;
    border-bottom: 1px solid #f2f2f2;
    animation: backgroundChange .8s linear;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    .status {
      font-size: 28px;
      .success {color: rgb(65, 211, 102)}
      .error {color: rgb(255, 143, 143)}
      .stop {color: rgb(231, 163, 62)}
    }
    .info {
      margin-left: 15px;
      .time {
        font-size: 16px;
        font-weight: bold;
      }
    }
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