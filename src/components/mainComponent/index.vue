<!--
 * @Author: KESHAOYE
 * @Date: 2022-09-14 23:03:18
-->
<!--main组件（引入其他业务组件）-->
<template>
  <div>
    <el-tabs @tab-click="handleClick">
      <el-tab-pane v-for="item in category" :key="item.category" :label="item.category" :name="String(item.id)">
        <modelPicker v-if="categoryIndex!=-1"></modelPicker>
        <cityPicker v-if="tag"></cityPicker>
        <shopPicker v-if="tag"></shopPicker>
        <submit v-if="tag"></submit>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { SKU } from '../../data/model'
import modelPicker from './modelPicker.vue'
import cityPicker from './cityPicker.vue'
import shopPicker from './shopPicker.vue'
import submit from './submit.vue'
import {mapMutations, mapState} from 'vuex'

export default {
  name: 'categorySelect',
  data() {
    return {
      category: [],
      nowCategory: null,
      tag:false
    }
  },
  computed: {
    ...mapState(['categoryIndex', 'canGetStore'])
  },
  components: {
    modelPicker,
    cityPicker,
    shopPicker,
    submit
  },
  watch: {
    '$store.state.selectSku'(newVal) {
      if(newVal != null) {
        this.tag = true
      } else {
        this.tag = false
      }
    }
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
      this.changeCategoryIndex(Number(tab.name))
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