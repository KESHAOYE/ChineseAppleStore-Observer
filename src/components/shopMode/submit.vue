<!--
 * @Author: KESHAOYE
 * @Date: 2022-09-15 01:24:15
-->
<template>
  <div class="submit">
    <div class="info"></div>
    <span class="tips">间隔时间：<span class="gray">监听的间隔时间(秒)</span></span>
    <div class="interval">
      <el-input-number v-model="interval" :step="1" controls-position="right" :min="5" step-strictly></el-input-number>
      <el-checkbox style="margin-left: 20px;" v-model="now">任务开始时立即执行</el-checkbox>
    </div>
    <div class="buttons">
      <el-button type="primary" plain @click='openAddMenu' :disabled='!submitFlag'>添加任务</el-button>
    </div>
    <addTaskMenu :modelInfo="modelInfo" :storeInfo="storeInfo" :now="now" :interval="interval" v-if="submitFlag" :dialogVisible.sync="dialogAddTaskVisible"></addTaskMenu>
  </div>
</template>

<script>
import addTaskMenu from '../dialog/addTaskMenu.vue'
export default {
  name: 'submit',
  data() {
    return {
      store: null,
      interval: 5,
      dialogAddTaskVisible: false,
      submitFlag: false,
      now: false
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
    '$store.state.interval': {
       handler(newval) {
         this.interval = newval / 1000
       },
       deep: true
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
  components: {addTaskMenu},
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
  },
  mounted() {
    this.interval = this.$store.state.interval / 1000
  }
}
</script>

<style lang="scss" scoped>
    .submit {
      min-width: 550px;
      margin-left: 3%;
      .interval{
        font-size: 2em;
        font-weight: bolder;
      }
      .buttons{
        margin-top: 20px;
      }
    }
</style>