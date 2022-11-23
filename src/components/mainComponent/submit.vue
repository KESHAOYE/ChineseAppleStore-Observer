<!--
 * @Author: KESHAOYE
 * @Date: 2022-09-15 01:24:15
-->
<template>
  <div class="submit">
    <div class="info"></div>
    <span class="tips">间隔时间：<span class="gray">监听的间隔时间</span></span>
    <div class="intelval">
      <el-input-number v-model="intelval" :step="5" controls-position="right" :min="5" step-strictly></el-input-number>秒
    </div>
    <div class="buttons">
      <el-button type="primary" @click='openAddMenu'>添加任务</el-button>
      <el-button type="danger" @click="dialogTaskListVisible = true">任务列表</el-button>
    </div>
    <addTaskMenu :modelInfo="modelInfo" :storeInfo="storeInfo" v-if="submitFlag" :dialogVisible.sync="dialogAddTaskVisible"></addTaskMenu>
    <taskList :dialogVisible.sync="dialogTaskListVisible"></taskList>
  </div>
</template>

<script>
import store from '../../../utils/store'
import addTaskMenu from './dialog/addTaskMenu.vue'
import taskList from './dialog/taskList.vue'
export default {
  name: 'submit',
  data() {
    return {
      store: null,
      intelval: 5,
      dialogAddTaskVisible: false,
      dialogTaskListVisible:false,
      submitFlag: false
    }
  },
  props: {
    modelInfo: {
      require: true,
      type: Object
    },
    storeInfo: {
      require: true,
      type: Object
    }
  },
  watch: {
    intelval(newval) {
      store.commit('changeIntelval', newval * 1000)
    },
    modelInfo: {
      handler() {
        this.checkArguments()
      },
      deep: true
    },
    storeInfo: {
      handler() {
       this.checkArguments()
      },
      deep: true
    }
  },
  components: {addTaskMenu, taskList},
  methods: {
    openAddMenu() {
      if(this.submitFlag) {
        this.dialogAddTaskVisible = true
      } else {
        this.$message.error('缺少必要参数,请检查')
      }
    },
    checkArguments() {
      this.submitFlag = true
      for(let i in this.modelInfo)
        if(this.modelInfo[i] == null) {
          this.submitFlag = false
        }
      for(let i in this.storeInfo)
        if(this.storeInfo[i] == null) {
          this.submitFlag = false
        }
    }
  }
}
</script>

<style>
  .submit {
    margin-left: 1%;
  }
  .interval{
    font-size: 2em;
    font-weight: bolder;
  }
  .buttons{
    margin-top: 20px;
  }
</style>