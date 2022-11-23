<!-- 机型及SKU选择组件 -->
<template>
  <div>
   <!-- 机型选择 -->
   <!-- 选择品类 -->
    <div class="choose_model">
      <div class="types" :class="{type_select: i.id == selectTypeId}" v-for="i in type" :key="i.name" @click='readModel(i.id)'>
        <figure class="type_icon" :style="{backgroundImage: `url(${i.icon})`}"></figure>
        <span class="type_name">{{i.name}}</span>
      </div>
    </div>
    <!-- 选择机型 -->
   <div class="main_choose" v-if="selectTypeId != -1">
    <div class="show_phone">
      <img :src="nowImage"/>
    </div>
    <div class="choose_property">
      <span class="tips">机型：<span class="gray">选择你中意的机型</span></span>
      <div class="choose_models" v-if="models.length > 0">
         <div class="models" v-for="i in models"  :class="{model_select: i.id == modelIndex}" :key="i.name" @click="readSku(i.id, i.name)">{{i.name}}</div>
       </div>
       <el-empty :image-size="50" description="暂无可选机型" v-else></el-empty>
      <!-- SKU1-一般是颜色 -->
      <span class="tips">外观：<span class="gray">选择你喜欢的颜色</span></span>
      <span class="tips" style="margin:10px 0;font-size:1em"> <span v-if="selectInfo.selectColor !=null">{{this.selectInfo.selectColor}}</span></span>  
        <div class="colorPicker" v-if="skus.length>0">
          <div class="color_ring" v-for="i in skus" :key="i.color" :class="{color_select: i.chineseColor == selectInfo.selectColor}">
            <div class="colors"  @click="createRom(i.id, i.chineseColor)" :style="{background: i.value}"></div>
          </div>
        </div>
        <el-empty :image-size="50" description="暂无可选颜色" v-else></el-empty>
       <!--sku2 存储-->
       <span class="tips">存储容量：<span class="gray">你要多大的容量？</span></span>
        <div class="choose_models Picker" v-if="roms.length>0">
          <div class="models rows" :class="{model_select: key == selectInfo.selectRom}" v-for="(i, key) in roms[0]" :key="key" @click="generatorSku(i,key)">{{key}}</div>
        </div>
        <el-empty :image-size="50" description="暂无可选容量" v-else></el-empty>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import {SKU} from '../../data/model'

export default {
  name: 'modelPicker',
  data() {
    return {
      type: [],
      models:[],
      skus:[],
      roms:[],
      modelIndex:-1,
      nowImage: 'https://www.apple.com.cn/newsroom/images/apple-logo_black.jpg.landing-big.jpg',
      selectInfo: {
        selectModel: '',
        selectRom: null,
        selectColor: null,
        selectSku: null
      }
    }
  },
  // 组件接收参数
  props: {
    // 品类
    category: {
      type: String,
      default: 'iPhone'
    }
  },
  computed: {
    ...mapState(['selectTypeId', 'categoryIndex'])
  },
  watch: {
    selectInfo: {
      deep: true,
      handler(newval) {
        console.log(newval)
        this.$emit('updateInfo', newval)
      }
    }
  },
  methods: {
    ...mapMutations(['init', 'changeSelectTypeId']),
    // 根据品类ID读取机型系列
    readType() {
      if(this.categoryIndex != -1) {
        for(let id in SKU[this.categoryIndex].model) {
          let type =  SKU[this.categoryIndex].model[id]
          this.type.push({
            id: id,
            name: type.name,
            icon: type.icon
          })
        }
        this.selectInfo = {
          selectModel: '',
          selectRom: null,
          selectColor: null,
          selectSku: null
        }
        this.modelIndex = -1
        this.nowImage = 'https://www.apple.com.cn/newsroom/images/apple-logo_black.jpg.landing-big.jpg'
        this.roms = []
        this.color = []
      } else {
        this.$message({
          message: '出现未知错误!',
          type: 'error',
          duration: 1500
        })
      }
    },
    readModel(id) {
      this.models = []
      this.skus = []
      this.roms =[]
      this.init()
      this.changeSelectTypeId(id)
      for(let mid in SKU[this.categoryIndex].model[id].children) {
        let model = SKU[this.categoryIndex].model[id].children[mid]
        this.models.push({
          id: mid,
          ...model
        })
        this.nowImage = SKU[this.categoryIndex].model[id].children[0].image
      }
      this.selectInfo = {
          selectModel: '',
          selectRom: null,
          selectColor: null,
          selectSku: null
        }
        this.modelIndex = -1
        // this.nowImage = 'https://www.apple.com.cn/newsroom/images/apple-logo_black.jpg.landing-big.jpg'
        this.roms = []
        this.color = []
    },
    // 保存机型，根据机型读取颜色
    readSku(id, name) {
      this.skus = []
      this.modelIndex = id
      this.selectInfo = {
        selectModel: name,
        selectColor: null,
        selectSku:null,
        selectRom: null
      }
      this.nowImage = this.models[id].image
      for(let sid in this.models[id].skus) {
        let sku = this.models[id].skus[sid]
        this.skus.push({
          id: sid,
          ...sku
         })
         this.roms = []
         this.color = []
      }
    },
    // 保存颜色，根据颜色读取存储
    createRom(id, chinese) {
      this.roms = []
      this.selectInfo.selectColor = chinese
      this.nowImage = this.models[this.modelIndex].skus[id].image
      for(let s of this.models[this.modelIndex].skus[id].ids) {
        this.roms.push(s)
     }
  },
  // 生成sku
  generatorSku(sku, rom) {
    this.selectInfo.selectSku = sku
    this.selectInfo.selectRom = rom
  }
},
  mounted() {
    this.readType()
  }
}
</script>

<style lang="scss">
  .choose_model {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    transition: .5s;
    cursor:pointer;
    border-bottom: 1px solid #f6f6f6;
    margin-bottom: 15px;
    .types {
      width: 100px;
      height: 100px;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      font-size: .8em;
      .type_icon{
        width:40px;
        height: 50px;
        display: block;
        background-size: 40px 50px;
      }
      &:hover{
        color:#06c;
      }
    }
    .type_select {
        color: #06c
      }
  }
  .main_choose{
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    align-items: center;
    .show_phone{
      width: 55%;
      img{
        width:auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
      }
    }
    .choose_property {
      width: 38%;
      margin-left: 3%;
      .choose_models {
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-start;
        align-items: flex-start;
        .model_select {
          border: 1px solid #000 !important;
        }
        .models {
          width: 250px;
          height: 60px;
          border: 1px solid #d2d2d2;
          border-radius: 15px;
          text-align: center;
          line-height: 60px;
          cursor:pointer;
          margin: 10px 0 0 10px;
          &:hover{
           border: 1px solid rgb(43, 43, 43);
          }
        }
      }
    }
  }
  .colorPicker {
   display: flex;
   flex-flow: row nowrap;
   justify-content: flex-start;
   align-content: center;
    .color_select {
      border:1px solid #06c !important;
    }
    .color_ring {
      width: 50px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      margin-left: 15px;
      border: 1px solid #fff;
      &:first-child {
        margin: 0;
      }
      &:hover{
        border:1px solid #e2e2e2;
      }
    } 
    .colors{
      width: 40px;
      height: 40px;
      display: block;
      border-radius: 50%;
      cursor: pointer;
  }
  }
</style>