<!--
 * @Author: KESHAOYE
 * @Date: 2022-11-26 14:04:48
-->
<template>
    <el-dialog title="设置" :visible.sync="data_visiable" :close-on-click-modal="false" :before-close="closeDialog" width="70%">
      <el-container style="height: 500px">
        <el-aside width="200px">
          <el-menu :collapse="collapse" default-active="1" @select="changeSelect">
            <el-menu-item v-for="(i,key) in settingMenu" :index="(i.index).toString()" :key="key">
              <i :class="i.icon"></i>
              <span slot="title">{{i.name}}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-container>
          <el-header>
            <div class="setting_title">{{settingMenu[nowSetting-1].name}}</div>
            <div class="setting_descript">{{settingMenu[nowSetting-1].descript}}</div>
          </el-header>
          <el-main style="padding-top:0">
            <message v-if="settingMenu[nowSetting-1].components == 'message'"/>
            <common v-if="settingMenu[nowSetting-1].components == 'common'"/>
            <about v-if="settingMenu[nowSetting-1].components == 'about'"/>
          </el-main>
        </el-container>
      </el-container>
    </el-dialog>
  </template>
  
  <script>
  import message from './message'
  import common from './common'
  import about from './about'
  export default {
    data(){
      return {
        data_visiable: false,
        collapse: false,
        settingMenu: [
          { 
            index:1,
            icon: 'el-icon-chat-dot-round',
            name: '新消息',
            descript: '消息通知方式、server酱',
            components:'message'
          },
          {
            index: 2,
            icon: 'el-icon-s-opportunity',
            name: '通用',
            descript: '间隔时长、模式',
            components:'common'
          },
          {
            //el-icon-collection
            index: 3,
            icon: 'el-icon-s-platform',
            name: '关于',
            descript: '版本信息',
            components:'about'
          }
        ],
        nowSetting: 1
      } 
    },
    components: {
      message,
      common,
      about
    },
    computed: {},
    watch: {},
    methods: {
      closeDialog() {
        this.data_visiable = false
      },
      changeSelect(index) {
        this.nowSetting = index
      }
    },
    mounted() {
      this.$EventBus.$on('toggleSetting', (state)=>{
        this.data_visiable = state
      })
    }
  }
  </script>
  
  <style lang="scss">
   .setting_title {
    font-size: 18px;
    font-weight: bold;
   }
   .setting_descript {
    font-size: 14px;
    font-weight: lighter;
    color: #d2d2d2;
    margin-top: 5px;
   }
  </style>