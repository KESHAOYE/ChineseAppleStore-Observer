<!--
 * @Author: KESHAOYE
 * @Date: 2022-09-14 23:03:18
-->
<!--main组件（引入其他业务组件）-->
<template>
  <div>
    <el-tabs @tab-click="handleClick">
      <el-tab-pane v-for="item in category" :key="item.category" :label="item.category" :name="String(item.id)">
        <modelPicker @updateInfo='updateModel'></modelPicker>
        <cityPicker @updateInfo="updateStore" v-if="selectTypeId != -1"></cityPicker>
        <submit :modelInfo="selectInfo" :storeInfo="storeInfo" v-if="selectTypeId != -1"></submit>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { SKU } from '../../data/model'
import modelPicker from './modelPicker.vue'
import cityPicker from './cityAndStorePicker.vue'
import submit from './submit.vue'
import {mapMutations, mapState} from 'vuex'

export default {
  name: 'categorySelect',
  data() {
    return {
      category: [],
      nowCategory: null,
      selectInfo: {
        selectColor: null,
        selectModel: null,
        selectRom: null,
        selectSku: null
      },
      storeInfo:{
        city: null,
        province: null,
        id: null,
        label: null,
        value: null
      }
    }
  },
  computed: {
    ...mapState(['selectTypeId', 'categoryIndex'])
  },
  components: {
    modelPicker,
    cityPicker,
    submit
  },
  methods: {
    ...mapMutations(['changeCategoryIndex']),
    // 读取加载品类(iPhone等)
    readCategory() {
      for(let i of SKU) {
        let count = 0
        this.category.push({
          id: count,
          category:i.category,
          chinese:i.chinese
        })
        count++
      }
    },
    handleClick(tab) {
      this.nowCategory = Number(tab.name)
      this.changeCategoryIndex(Number(tab.name))
    },
    updateModel(e) {
      this.selectInfo = e
    },
    updateStore(e) {
      console.log(e)
      this.storeInfo = e
    }
  },
  mounted() {
    this.readCategory()
    this.changeCategoryIndex(0)
  }
}
</script>

<style>
</style>