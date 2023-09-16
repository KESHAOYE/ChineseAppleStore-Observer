<!-- 机型及SKU选择组件 -->
<template>
  <div>
<!-- 选择机型 -->
<div class="main_choose" v-if="selectTypeId != -1">
    <div class="choose_property">
      <span class="tips">机型：<span class="gray">选择你中意的机型</span></span>
      <div class="choose_models" v-if="model.models.length > 0">
         <div class="models" v-for="i in model.models"  :class="{model_select: i.id == modelIndex}" :key="i.name" @click="readSku(i.id, i.name)">
           <span class="model_name">{{i.name}}</span>
           <span class="model_screen">{{i.screen}}</span>
         </div>
       </div>
       <el-empty :image-size="50" description="暂无可选机型" v-else></el-empty>
      <!-- SKU1-一般是颜色 -->
      <span class="tips">外观：<span class="gray">选择你喜欢的颜色</span></span>
      <span class="tips" style="margin:10px 0;font-size:1em"> <span>{{this.selectInfo.selectColor || '未选择颜色'}}</span></span>  
        <div class="colorPicker" v-if="model.skus.length>0">
          <div class="color_ring" v-for="i in model.skus" :key="i.color" :class="{color_select: i.chineseColor == selectInfo.selectColor}">
            <div class="colors"  @click="createRom(i.id, i.chineseColor)" :style="{background: i.value}"></div>
          </div>
        </div>
        <el-empty :image-size="50" description="暂无可选颜色" v-else></el-empty>
       <!--sku2 存储-->
       <span class="tips">存储容量：<span class="gray">你要多大的容量？</span></span>
        <div class="choose_models Picker" v-if="model.roms.length>0">
          <div class="models rows" :class="{model_select: key == selectInfo.selectRom}" v-for="(i, key) in model.roms[0]" :key="key" @click="generatorSku(i.value,key)">
            <span class="model_name">{{key}}</span>
            <span class="price">
              <div>RMB {{Math.ceil(i.price / 24)}}/月或</div>
              <div>RMB{{i.price}}</div>
            </span>
          </div>
        </div>
        <el-empty :image-size="50" description="暂无可选容量" v-else></el-empty>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'modelPicker',
  data() {
    return {
      modelIndex:-1,
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
    ...mapState(['selectTypeId', 'categoryIndex', 'model'])
  },
  watch: {
    selectInfo: {
      deep: true,
      handler(newval) {
        this.$emit('updateInfo', newval)
      }
    },
    modelIndex(newval) {
      console.log(newval);
      if(newval == -1) {
        this.changeModel(['skus', '', true])
        this.changeModel(['roms', '', true])
      }
    }
  },
  methods: {
    ...mapMutations(['changeModel', 'changeNowImage']),
    // 保存机型，根据机型读取颜色
    readSku(id, name) {
      this.changeModel(['skus','',true])
      this.modelIndex = id
      this.selectInfo = {
        selectModel: name,
        selectColor: null,
        selectSku:null,
        selectRom: null
      }
      this.changeNowImage(this.model.models[id].image)
      for(let sid in this.model.models[id].skus) {
        let sku = this.model.models[id].skus[sid]
        this.changeModel(['skus',{
          id: sid,
          ...sku
         }, false])
         this.changeModel(['roms', '', true])
      }
    },
    // 保存颜色，根据颜色读取存储
    createRom(id, chinese) {
      this.changeModel(['roms', '', true])
      this.selectInfo.selectColor = chinese
      this.selectInfo.selectSku = null
      this.selectInfo.selectRom = null
      this.changeNowImage(this.model.models[this.modelIndex].skus[id].image)
      for(let s of this.model.models[this.modelIndex].skus[id].ids) {
        this.changeModel(['roms', s, false])
     }
  },
  // 生成sku
  generatorSku(sku, rom) {
    this.selectInfo.selectSku = sku
    this.selectInfo.selectRom = rom
  }
},
  mounted() {
    this.$EventBus.$on('clearInfo', ()=>{
      this.modelIndex = -1
      this.selectInfo = {
        selectModel: '',
        selectRom: null,
        selectColor: null,
        selectSku: null
      }
    })
  }
}
</script>

<style lang="scss" scoped>
  .main_choose{
    margin-top: 25px;
    .choose_property {
      width: 550px;
      min-width: 550px;
      margin-left: 3%;
      .choose_models {
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-start;
        align-items: flex-start;
        .model_select {
          border: $--var-select-border !important;
        }
        .models {
          width: 350px;
          padding: 15px;
          min-height: 60px;
          border: 1px solid #525151;
          border-radius: 15px;
          text-align: center;
          line-height: 60px;
          cursor:pointer;
          margin: 10px 0 10px 10px;
          .model_name {
            display: block;
            text-align: left;
            font-weight: bolder;
            letter-spacing: 1px;
            height: 20px;
            margin-left: 15px;
          }
          .model_screen {
            display: block;
            text-align: left;
            font-weight: lighter;
            letter-spacing: 1px;
            margin-top: 10px;
            font-size: 0.8em;
            margin-left: 15px;
          }
          .price {
            float: right;
            display: block;
            margin-right: 15px;
            line-height: 100%;
            font-weight: lighter;
            font-size: 0.8em;
            div{
              margin-top: 5px;
            }
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
      transition: .2s;
      border:$--var-select-border !important;
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