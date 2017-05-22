<template>
  <div class="item-content" :class="session.send==selfUserId?'self':''">
    <div class="content-left">
      <!--<span class="content-status" :class="'status-fail'">已发送</span>-->
      <span class="content-text" v-if="session.msgtype == 2 && session.message.customType == 1">【面试邀请函】</span>
      <span class="content-text" v-else v-text="session.message || '开始聊天吧'"></span>
    </div>
    <span class="content-unread" v-if="unreadCount[dataSessionId]" v-text="unreadCount[dataSessionId]"></span>
  </div>
</template>

<script>
export default {
  props: ['dataIndex', 'dataTitle', 'dataSessionId'],
  computed: {
    unreadCount () {
      return this.$store.state.unreadCount
    },
    selfUserId () {
      return this.$store.state.account
    },
    session () {
      let _msg = this.$parent.sessionList[this.dataTitle][this.dataIndex]
      if (Number(_msg.msgtype) !== 1 && _msg.hasOwnProperty('message')) {
        /***
         * 非文本消息
         */
        try {
          _msg.message = JSON.parse(_msg.message)
        } catch (err) {}
      }
      return _msg
    }
  },
  methods: {
  },
  components: {
  }
}
</script>

<style scoped lang="scss">
  .item-content {
    position: relative;
    overflow: hidden;
    width: 224px;
    height: 20px;
    padding: 0 0 0 20px;
    font-size: 12px;
    line-height: 18px;
    white-space: nowrap;
    text-overflow: ellipsis;
    pointer-events: none;
    &.self {
      .content-status {
        display: inline-block!important;
      }
    }
    .content-left {
      width: 180px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .content-status {
      position: relative;
      float: left;
      display: none;
      padding: 4px 8px;
      font-size: 12px;
      line-height: 12px;
      color: #999;
      background-color: #e7eaf4;
      margin-right: 2px;
      border-radius: 10px;
    }
    .content-text {

    }
    .content-unread {
      position: absolute;
      right: 0;
      top: 0;
      display: inline-block;
      padding: 0 7px;
      font-size: 12px;
      height: 18px;
      border-radius: 10px;
      background-color: #fa6460;
      color: #fff;
    }
  }
</style>
