<!--
 * @Author: KESHAOYE
 * @Date: 2022-12-04 13:53:19
-->
<template>
    <div class="show_phone">
      <img :src="nowImage" alt="这里是机型图片"/>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {...mapState(['nowImage'])}
}
</script>

<style lang="scss">
    .show_phone{
      margin-top: $--var-left-image-marginTop;
      width: 100%;
      height: 100%;
      min-width:800px;
      min-height: 500px;
      border-radius: 18px;
      overflow: hidden;
      top: 3%;
      img{
        border-radius: 18px;
        width: $--var-left-image-width;
        height: $--var-left-image-height;
        min-width: 800px;
        min-height: 500px;
        transition: .3;
      }
    }
</style>