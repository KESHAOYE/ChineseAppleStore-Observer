<template>
  <div class="shopPicker" v-loading="loading">
    <span class="tips">Apple Store：<span class="gray">想在哪家店购机？</span></span>
    <div class="shopList" v-if="lastShop.length > 0">
      <div class="shopitems" v-for="i in lastShop" :class="{shop_select: i.storeName == nowShop}" :key="i.storeNumber" @click="selectShop(i.storeName)">
        {{i.state}}{{i.city}}{{i.address.address}}
      </div>
    </div>
    <el-empty description="暂无可选商店" v-else></el-empty>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
import { getStock } from '../../data/api'
export default {
  name: 'shopPicker',
  data() {
    return {
      lastShop: [],
      store: null,
      nowShop: null,
      loading: false
    }
  },
  computed: {
    ...mapState(['selectSku', 'canGetStore', 'nowProvince']),
    ...mapGetters(['location']),
  },
  watch: {
    '$store.state.canGetStore'(newVal) {
      if(newVal > 0) {
        this.getLastShop(this.location, this.selectSku)
      }
    }
  },
  methods: {
    ...mapMutations(['changeCanGetStore','changeSelectShop']),
    getLastShop (location, sku) {
      this.lastShop = []
      this.loading = true
      getStock({
        'mts.0': 'regular',
        'parts.0': sku,
        location,
      }).then(res=> {
        for(let i of res.content.pickupMessage.stores) {
          // 过滤同一省份
          if(i.state == this.nowProvince) {
            this.lastShop.push(i)
          }
        }
        if(this.lastShop.length>0) {
        this.$message({
            message: '已为你找到附近的店铺！',
            type: 'success'
          })
        } else {
          this.$message({
            message: '附近暂无店铺，请重新选择城市！',
            type: 'error'
          })
        }
        this.changeCanGetStore(0)
        this.loading = false
      })
      .catch((e)=>{
        console.log(e)
        this.changeCanGetStore(0)
        this.loading = false
      })
    },
    selectShop(shopName) {
      this.nowShop = shopName
      console.log(shopName)
      this.changeSelectShop(this.nowShop)
    }
  },
}
</script>

<style lang="scss">
       .shopPicker {
        margin-left: 1%;
       }
        .shopList {
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-start;
        align-items: flex-start;
        .shop_select {
          border: 1px solid #000 !important;
        }
        .shopitems {
          width: 250px;
          height: 60px;
          border: 1px solid #d2d2d2;
          border-radius: 15px;
          text-align: center;
          line-height: 60px;
          cursor:pointer;
          margin: 5px 0 0 10px;
          &:first-child{
            margin: 5px 0 0 -2px;
          }
          &:hover{
           border: 1px solid rgb(43, 43, 43);
          }
        }
      }
</style>