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
          <el-option v-for="item in stores" :key="item.id" :label="item.label" :value="item.id"></el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import {storeList} from '../../data/applestore'
export default {
  name: 'cityPicker',
  data () {
    return {
      provinces: [],
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
      storeList[0].state.forEach(el=>{
        this.provinces.push({value:el.name,label:el.name})
      })
    },
    readStore() {
      this.stores= []
      this.loading = true
      this.nowStore = null
      storeList[0].state.forEach(state=>{
        if(state.name === this.nowProvince) {
          state.store.forEach(store=> {
            this.stores.push({
              province: this.nowProvince,
              id: store.id,
              value: store.name,
              label: `Apple${store.name}店`,
              city: store.address.city
            })
          })
        }
      })
      this.loading = false
    },
    updateStoreInfo(e) {
      this.storeInfo = this.stores[this.stores.findIndex(el=>el.id == e)]
      this.$emit('updateInfo', this.storeInfo)
    }
  },
  mounted() {
    this.readProvince()
  }
}
</script>

<style>
  .cityPicker{
    margin-left: 1%;
  }
</style>
