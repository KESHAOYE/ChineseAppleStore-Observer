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
import aMain from './components/shopMode/index'
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
  },
  methods: {
    unload(e) {
      e.preventDefault()
      e.returnValue = "";
    }
  },
  mounted() {
    window.addEventListener('beforeunload', this.unload)
    // window.addEventListener('scroll', (e)=>{
    //   console.log(document.documentElement.scrollTop);
    //   // const width = document.documentElement.clientWidth
    //   // if(e.target.scrollTop > e.target.clientHeight - ((width - 630)/16) * 9) {
    //   //   document.getElementsByTagName('body')[0].style.setProperty('--bodyOverflow', `scroll`)
    //   //   document.getElementsByTagName('body')[0].style.setProperty('--rightOverflow', `hidden`)
    //   //   document.getElementsByTagName('body')[0].style.setProperty('--rightHeight', `100%`)
    //   // }
    // })
  }
}
</script>

<style lang="scss">
    // body {
    //   overflow: $--var-body-overflow;
    // }
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
      margin-top: 60px;
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
