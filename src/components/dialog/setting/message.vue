<!--
 * @Author: KESHAOYE
 * @Date: 2022-11-26 14:33:51
-->
<template>
  <div class="settings">
    <div class="setting_item">
      <div class="tips">
        <div class="content">弹窗通知</div>
        <div class="descript">默认是否开启全局弹窗通知</div>
      </div>
      <el-switch v-model="dialogMessage" />
    </div>
    <div class="setting_item setting_item_withoutbottom">
      <div class="tips">
        <div class="content">server酱通知</div>
        <div class="descript">默认是否开启server酱通知(需配置)</div>
      </div>
      <el-switch v-model="serverchanMessage"  />
    </div>
    <div class="setting_item" v-if="serverchanMessage">
      <el-input v-model="serverchanKey" style="width:350px" size="mini" placeholder="配置server酱的send_key" />
      <el-link href="https://sct.ftqq.com/" target="_blank" type="danger">查看教程</el-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      serverchan_key: ''
    }
  },
  computed: {
    dialogMessage: {
      get() {
        return this.$store.state.setting.dialogMessage
      },
      async set(val) {
        if(val) {
          if(Notification.permission!= "granted") {
            await Notification.requestPermission()
            if (Notification.permission == 'denied') {
              this.$message.error('功能不可用,无通知权限,请检查设置')
              this.dialogMessage = false
              return;
            }
          }
        }
        localStorage.setItem('setting', JSON.stringify({
          ...JSON.parse(localStorage.getItem('setting')),
          dialogMessage: val
        }))
        this.$store.commit('setMessage', ['dialogMessage', val])
      }
    },
    serverchanMessage: {
      get() {
        return this.$store.state.setting.serverchanMessage
      },
      set(val) {
        console.log(val)
        localStorage.setItem('setting', JSON.stringify({
          ...JSON.parse(localStorage.getItem('setting')),
          serverchanMessage: val
        }))
        this.$store.commit('setMessage', ['serverchanMessage', val])
      }
    },
    serverchanKey: {
      get() {
        return this.$store.state.setting.serverchan_sendkey
      },
      set(val) {
        localStorage.setItem('setting', JSON.stringify({
          ...JSON.parse(localStorage.getItem('setting')),
          serverchan_sendkey: val
        }))
        this.$store.commit('setMessage', ['serverchan_sendkey', val])
      }
    }
  }
}
</script>

<style lang="scss">
  .settings{
    .setting_item_withoutbottom {
      border: 0 !important;
    }
    .setting_item{
      width: 480px;
      min-height: 50px;
      border-bottom: 1px solid #f8f8f8;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      .tips {
        width: 220px;
        font-size: 14px;
        font-weight: lighter;
        .descript{
            font-size: 13px;
            color: #c4c3c3;
            margin-top: 2px;
        }
      }
    }
  }
</style>