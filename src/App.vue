<!--
 * @Author: KESHAOYE
 * @Date: 2022-11-21 00:21:51
-->
<template>
  <div id="app">
    <a-header></a-header>
    <a-main></a-main>
    <a-foot></a-foot>
  </div>
</template>

<script>

import aHeader from './components/header/index'
import aMain from './components/main/index'
import aFoot from './components/footer/index'

export default {
  name: 'App',
  components: {
    aMain,
    aHeader,
    aFoot
  },
  beforeCreate() {
    if(localStorage.getItem('setting')){
      this.$store.commit('initSetting', JSON.parse(localStorage.getItem('setting')))
    }
    if(localStorage.getItem('interval')) {
      this.$store.commit('changeInterval', localStorage.getItem('interval'))
    }
  }
}
</script>

<style lang="scss">
    @font-face{
       font-family:misans;
       src:url('./assets/font/MiSans-Normal.ttf');
       }
    * {
      font-family: misans;
      user-select: none;
    }
    .tips {
    font-weight: bolder;
    font-size: 1.3em;
    display: block;
    margin: 25px 0;
    .gray {
      color: rgb(94, 94, 94);
      font-weight:lighter;
    }
    #app{
      background: #f9f9f9;
      min-width: 1024px;
    }
  }
</style>
