<!--
 * @Author: KESHAOYE
 * @Date: 2022-09-14 23:03:18
-->
<!--main组件（引入其他业务组件）-->
<template>
  <div>
    <el-tabs @tab-click="handleClick">
      <el-tab-pane v-for="item in category" :key="item.category" :label="item.category" :name="String(item.id)">
        <modelPicker></modelPicker>
        <div class="content">
          <div class="left_content">
            <showModel></showModel>
          </div>
          <div class="right_content">
            <skuPicker @updateInfo='updateModel'/>
            <cityPicker @updateInfo="updateStore" v-if="selectTypeId != -1"/>
            <submit :modelInfo="selectInfo" :storeInfo="storeInfo" v-if="selectTypeId != -1"/>
          </div>
          <taskList/>
          <setting/>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { SKU } from '../../data/model'
import modelPicker from './modelPicker'
import cityPicker from './cityAndStorePicker'
import skuPicker from './skuPicker.vue'
import showModel from './showModel.vue'
import submit from './submit'
import taskList from '../dialog/taskList'
import setting from '../dialog/setting'
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
    submit,
    taskList,
    showModel,
    skuPicker,
    setting
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
      this.storeInfo = e
    },
    countNowPageSize() {
      const width = document.documentElement.clientWidth
      const height = document.documentElement.clientHeight
      let countWidth = width - 630 <= 800 ? 800 : width - 630
      let countHeight = ((width - 630)/16) * 9
      if( countHeight > height) {
        countHeight  = height - 200
      }
      // 保证比例为16：9
      document.getElementsByTagName('body')[0].style.setProperty('--leftImageWidth', `${countWidth}px`)
      document.getElementsByTagName('body')[0].style.setProperty('--leftImageHeight', `${countHeight}px`)
      document.getElementsByTagName('body')[0].style.setProperty('--leftImageMarginTop', `calc(${height}-${countHeight}-150px)`)
    }
  },
  mounted() {
    this.readCategory()
    this.changeCategoryIndex(0)
    this.countNowPageSize()
    window.onresize = ()=>{
      this.countNowPageSize()
    }
  }
}
</script>

<style lang="scss" scoped>
  .content {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    .left_content {
      margin-top: 50px;
    }
  }
</style>