<template>
    <div>
        <div class="view-tt">正在沟通的职位是：<span v-text="session.title"></span></div>
        <div class="chat-view" id="chat-scroll" ref="chatView">
            <!--<span v-text="" style="display: none;"></span>-->
            <div class="chat-view-content">
                <div class="chat-view-item" v-for="(message, index) in messages" :key="message">
                    <div class="msg-item item-time" v-if="timeTip(index)">
                        <div :data-value="message.sendTime || message.sendtime || message.createTime" v-chat-time></div>
                    </div>
                    <zpm-text v-if="message.msgType == 1" :data-index="index" :data-type="1" :direction="message.sender==selfUserId?'1':'0'"></zpm-text>
                    <zpm-custom v-if="message.msgType == 2" :data-index="index" :direction="message.sender==selfUserId?'1':'0'"></zpm-custom>

                    <!--<div class="chat-view-item">-->
                        <!---->
                    <!--</div>-->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import * as types from '../../../store/mutation-types'
  import ZpmText from './common/ZpmText.vue'
  import ZpmCustom from './common/ZpmCustom.vue'
  export default {
    created: function () {
      const that = this
      if (!this.$store.hasOwnProperty('vms')) {
        this.$store.vms = {}
      }
      this.$store.vms.chatView = that

//      setTimeout(function () {
//        that.$store.commit(types.DO_SCROLL)
//      }, 100)
    },
    computed: {
      msgs () {
        return this.$store.state.msgs
      },
      session () {
        return this.$store.state.jobInfo
      },
      selfUserId () {
        return this.$store.state.account
      },
      currentAccount () {
        return this.$store.state.currentaccount
      },
      currentSession () {
        return this.$store.state.currentsession
      },
      messages () {
        return this.$parent.messages
      }
    },
    methods: {
      timeTip (index) {
        if (index === 0) {
          return true
        } else if (this.messages[index].sendTime - this.messages[index - 1].sendTime > 3 * 60 * 1000 ||
          this.messages[index].sendtime - this.messages[index - 1].sendtime > 3 * 60 * 1000 ||
          this.messages[index].createTime - this.messages[index - 1].createTime > 3 * 60 * 1000) {
          // 2条消息大于3分钟显示时间
          return true
        }
        return false
      }
    },
    components: {
      ZpmText,
      ZpmCustom
    }
  }
</script>

<style lang="scss">
    .chat-view {
        position: relative;
        height: 457px;
        overflow-y: auto;
        overflow-x: hidden;
        color: #333;
        padding: 0 25px 18px;
        .chat-view-content {
            /*height: 2000px;*/
            .chat-view-item {
                width: 100%;
                float: left;
                clear: both;
            }
            .item-time {
                div {
                    width: 100%;
                    height: 30px;
                    font-size: 12px;
                    color: #999;
                    text-align: center;
                    line-height: 30px;
                }
            }
        }
    }
    .view-tt {
        font-size: 16px;
        line-height: 45px;
        text-align: center;
    }
</style>
