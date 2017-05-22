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
            <div class="msg-content">
                <div class="bubble-arrow"></div>
                <div class="content-text" v-text="message.message"></div>
            </div>
        </div>
        <div v-if="message.sender == selfUserId && message.hasOwnProperty('readers') && message.messageStatus != '2'" class="msg-status">{{message.readers.length > 1 ? '已读' : '未读'}}</div>
        <div class="msg-status-loading" :data-warning="message.messageStatus" v-if="direction == 1 && message.hasOwnProperty('unique') && sendingQueue.hasOwnProperty(message.unique)">
            <img src="../../../../../static/loading2.gif">
        </div>
        <div class="msg-send-error" v-if="message.messageStatus == '2'">
            <i class="fa fa-fw fa-warning"></i>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'ZpmText',
    props: ['direction', 'dataIndex'],
    data () {
      return {
        message: this.$store.state.msgs[this.$store.state.currentsession][this.dataIndex] || {}
      }
    },
    computed: {
      selfUserId () {
        return this.$store.state.account
      },
      sendingQueue () {
        return this.$store.state.sendingQueue
      }
    }
  }
</script>