<!--
 * @Author: KESHAOYE
 * @Date: 2022-09-14 20:26:38
-->
<template>
  <div>
    <div class="cityPicker" v-loading = loading>
      <span class="tips">Apple Store：<span class="gray">想在哪里购机？</span></span>
      <el-select v-model="nowProvince" placeholder="省份" @change="readStore">
          <el-option v-for="item in provinces" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-select v-if="stores.length > 0" v-model="nowStore" @change="updateStoreInfo" placeholder="Apple Store" style="margin-left: 20px">
        <el-option v-for="item in stores[0].store" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-link style="margin-left: 20px" type="primary" v-if="nowStore" @click="storeDetail()">商店详情</el-link></div>
  </div>
</template>

<script>
// import {storeList} from '../../data/applestore'
import {getStore} from '../../data/api'
export default {
  name: 'cityPicker',
  data () {
    return {
      provinces: [],
      allStores: [],
      stores: [],
      storeInfo:null,
      nowProvince: null,
      nowStore: null,
      loading: false
    }
  },
  watch: {
  },
  methods: {
    readProvince() {
      this.provinces = []
      getStore()
       .then(data => {
          this.allStores = data.storeListData[0].state
          data.storeListData[0].state.forEach(el => {
            this.provinces.push({
              value:el.name,
              label:el.name
            })
          })
       })
      // this.provinces = []
      // storeList[0].state.forEach(el=>{
      //   this.provinces.push({value:el.name,label:el.name})
      // })
    },
    readStore() {
      this.loading = true
      this.nowStore = null
      this.stores = this.allStores.filter(el =>{
        if(el.name == this.nowProvince) {
          return el.store
        }
      })
      this.stores[0].store.forEach(el => {
        el.name = `APPLE${el.name}店`
      })
      this.loading = false
    },
    storeDetail() {
      window.open(`https://www.apple.com.cn/retail/${this.storeInfo.slug}`)
    },
    updateStoreInfo(e) {
      this.storeInfo = this.stores[0].store[this.stores[0].store.findIndex(el => el.id == e )]
      this.$emit('updateInfo', this.storeInfo)
    }
  },
  mounted() {
    this.readProvince()
  }
}
</script>

<style lang="scss">

    .cityPicker {
      min-width: 550px;
      margin-left: 3%;
    }
    .null_content {
      width: auto;
      max-width: 1500px;
      min-width: 1300px;
      min-height: 50px;
    }
</style>
