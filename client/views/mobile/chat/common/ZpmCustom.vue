<template>
    <div class="msg-item item-text" :class="direction == 1 ? 'right' : 'left'">
        <div class="user-icon">
            <img src="../../../../../static/male@2x.png">
        </div>
        <div class="msg-right-container">
            <!--<div class="user-name">-->
            <!--<span v-text="message.sender"></span>-->
            <!--<span data-format="YYYY-MM-DD H:M:S" :data-value="message.createTime" v-time-format></span>-->
            <!--</div>-->
            <div class="msg-content msg-content-custom">
                <div class="bubble-arrow"></div>
                <div class="bubble-arrow-white"></div>
                <!--<i class="fa fa-fw fa-angle-right"></i>-->
                <div>
                    <interview v-if="message.message.customType == 1"></interview>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import Interview from '../custom/Interview.vue'
  export default {
    name: 'ZpmCustom',
    props: ['direction', 'dataIndex'],
    data () {
      return {
      }
    },
    computed: {
      selfUserId () {
        return this.$store.state.account
      },
      sendingQueue () {
        return this.$store.state.sendingQueue
      },
      message () {
        let _msg = this.$store.state.msgs[this.$store.state.currentsession][this.dataIndex]
        if (_msg.hasOwnProperty('message')) {
          try {
            _msg.message = JSON.parse(_msg.message)
          } catch (err) {}
        }
        return _msg
      }
    },
    components: {
      Interview
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
