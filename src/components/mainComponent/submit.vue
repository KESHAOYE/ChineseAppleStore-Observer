<!--
 * @Author: KESHAOYE
 * @Date: 2022-09-15 01:24:15
-->
<template>
  <div class="submit">
    <div class="info"></div>
    <span class="tips">间隔时间：<span class="gray">监听的间隔时间</span></span>
    <div class="intelval">
      <el-input-number v-model="intelval" :step="5" controls-position="right" :min="10" step-strictly></el-input-number>秒
    </div>
    <div class="buttons">
      <el-button type="primary" @click='openAddMenu'>添加任务</el-button>
      <el-button type="danger" >任务列表</el-button>
    </div>
    <addTaskMenu :dialogVisible.sync="isOpenAddMenu"></addTaskMenu>
  </div>
</template>

<script>
import {beginObserve,stopTask} from '../../../utils/observer'
import store from '../../../utils/store'
import addTaskMenu from './dialog/addTaskMenu.vue'
export default {
  name: 'submit',
  data() {
    return {
      store: null,
      intelval: 10,
      isOpenAddMenu: false
    }
  },
  watch: {
    intelval(newval) {
      store.commit('changeIntelval', newval * 1000)
    }
  },
  components: {addTaskMenu},
  methods: {
    openAddMenu() {
      this.isOpenAddMenu = true
    },
    async add() {
      beginObserve().then(data=>{
        if(data.pickupDisplay === 'available') {
          console.log('有货')
          stopTask(data.intelval)
        }
      })
    }
  },
  mounted () {
    this.store.$subscribe((mutation, state) => {
      console.log(mutation, state);
      if(state.intelval<=10 ) {
        this.$message({
          message: '最短间隔时间为10秒哦~',
          type: 'danger'
        })
      }
    })
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