<!--
 * @Author: KESHAOYE
 * @Date: 2022-11-21 00:21:51
-->
<template>
  <div id="app">
    <mainComponent></mainComponent>
  </div>
</template>

<script>

import mainComponent from './components/mainComponent/index'

export default {
  name: 'App',
  components: {
    mainComponent
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
    }
    .tips {
    font-weight: bolder;
    font-size: 1.3em;
    display: block;
    margin: 25px 0;
    .gray {
      color: rgb(82, 82, 82)
    }
    #app{
      background: #f9f9f9;
      min-width: 1024px;
    }
  }
</style>
