<!--
 * @Author: KESHAOYE
 * @Date: 2022-09-14 20:26:38
-->
<template>
  <div class="cityPicker" v-loading = loading>
    <span class="tips">城市：<span class="gray">想在哪里购机？</span></span>
    <el-select v-model="nowProvince" placeholder="省份">
        <el-option v-for="item in province" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-select v-if="city.length > 0" v-model="nowCity" placeholder="城市" style="margin-left: 20px">
        <el-option v-for="item in city" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-button style="margin-left:15px" v-if="nowCity!=null" @click="refresh" type='primary' title="商店加载不出来?点此重新加载">重新加载</el-button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

import { getCityInfo } from '../../data/api'

export default {
  name: 'cityPicker',
  data () {
    return {
      province: [],
      city: [],
      nowProvince: null,
      nowCity: null,
      loading: false
    }
  },
  watch: {
    nowProvince (newVal) {
        this.city = []
        this.nowCity = null
        this.changeNowProvince(newVal)
        this.loading = true
        getCityInfo({state: newVal}).then(
          res => {
            this.city = res.city.data ? res.city.data : [{'label': res.city, 'value': res.city}]
            this.loading = false
          }
        )
    },
    nowCity(newVal) {
      this.changeNowCity(newVal)
    }
  },
  methods: {
    refresh() {
      this.changeCanGetStore(Math.random())
    },
    ...mapMutations(['changeCanGetStore','changeNowProvince', 'changeNowCity'])
  },
  mounted() {
    // 读取store
    getCityInfo({state: this.nowProvince}).then(
      res => {
        this.province = res.state.data
      }
    )
  }
}
</script>

<style>
  .cityPicker{
    margin-left: 1%;
  }
</style>
