<template>
    <div style="position: relative;">
        <div class="view-tt">正在沟通的职位是：<span v-text="session.title"></span></div>
        <!--<div class="chat-view" id="chat-scroll" ref="chatView">-->
            <!--&lt;!&ndash;<span v-text="" style="display: none;"></span>&ndash;&gt;-->
            <!--<div class="chat-view-content">-->
                <!--<div class="chat-view-item" v-for="(message, index) in messages" :key="message">-->
                    <!--<div class="msg-item item-time" v-if="timeTip(index)">-->
                        <!--<div :data-value="message.sendTime || message.sendtime || message.createTime" v-chat-time></div>-->
                    <!--</div>-->
                    <!--<zpm-text v-if="message.msgType == 1" :data-index="index" :data-type="1" :direction="message.sender==selfUserId?'1':'0'"></zpm-text>-->
                    <!--<zpm-custom v-if="message.msgType == 2" :data-index="index" :direction="message.sender==selfUserId?'1':'0'"></zpm-custom>-->
                <!--</div>-->
            <!--</div>-->
        <!--</div>-->
        <zpm-scroll class="chat-view" id="chat-scroll" :data-options="options" :data-need-pull-down="needPullDown" ref="chatView" @ready="scrollReady" @pulldown="pullDown">
            <div class="chat-view-item" v-for="(message, index) in messages" :key="message">
                <div class="msg-item item-time" v-if="timeTip(index)">
                    <div :data-value="message.sendTime || message.sendtime || message.createTime" v-chat-time></div>
                </div>
                <zpm-text v-if="message.msgType == 1" :data-index="index" :data-type="1" :direction="message.sender==selfUserId?'1':'0'"></zpm-text>
                <zpm-custom v-if="message.msgType == 2" :data-index="index" :direction="message.sender==selfUserId?'1':'0'"></zpm-custom>
            </div>
        </zpm-scroll>
        <transition name="new-message-count-transition" enter-active-class="animated bounceIn" leave-active-class="animated fadeOut">
            <div class="new-message-count-tip" v-if="newMessageCount > 0" @click="clearNewMessageCount">
                <span v-text="newMessageCount"></span>
                <div class="bubble-down"></div>
            </div>
        </transition>
    </div>
</template>

<script>
  import * as types from '../../../store/mutation-types'
  import ZpmText from './common/ZpmText.vue'
  import ZpmCustom from './common/ZpmCustom.vue'
  import ZpmScroll from '../../../components/ZpmScroll/ZpmScroll.vue'
  export default {
    data () {
      return {
        options: {
          bounce: true,
          useTransition: false,
          mouseWheel: true,
          scrollbars: true,
          fadeScrollbars: true,
          interactiveScrollbars: true,
          shrinkScrollbars: 'scale',
          scrollerName: 'chat'
        },
        needPullDown: true,
        needPullUp: false
      }
    },
    created: function () {
      const that = this
      if (!this.$store.hasOwnProperty('vms')) {
        this.$store.vms = {}
      }
      this.$store.vms.chatView = that
    },
    init () {
      const that = this
      setTimeout(function () {
        that.$store.commit(types.DO_SCROLL)
      }, 100)
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
      },
      newMessageCount () {
        return this.$store.state.newMessageCount
      }
    },
    methods: {
      clearNewMessageCount () {
        this.doScroll()
        this.$store.commit(types.SET_NEW_MESSAGE_COUNT, {
          count: 0
        })
      },
      doScroll () {
        this.$store.commit(types.DO_SCROLL)
      },
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
      },
      scrollReady (target) {
        const that = this
//        target.on('refresh', function () {
//          console.log('scroll ready: ', target)
//          that.$store.commit(types.SET_CHAT_SCROLL, {
//            target: target
//          })
//          target.lastMaxScrollY = target.maxScrollY
//          that.$store.commit(types.DO_SCROLL)
//        }, false)
        that.$store.commit(types.SET_CHAT_SCROLL, {
          target: target
        })
        target.lastMaxScrollY = target.maxScrollY
        that.doScroll()
        target.on('scroll', function () {
          if (this.y <= this.maxScrollY + 50) {
            that.$store.commit(types.SET_NEW_MESSAGE_COUNT, {
              count: 0
            })
          }
        })
      },
      pullDown: function (target) {
        const that = this
        setTimeout(function () {
          that.msg = [-4, -3, -2, -1].concat(that.msg)
          target.setRefresh()
          target.scrollTo(0, -30, 100)
//          console.log('_____', target.maxScrollY)
        }, 2000)
      }
    },
    components: {
      ZpmText,
      ZpmCustom,
      ZpmScroll
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
            position: relative;
            float: left;
            width: 100%;
            /*height: 2000px;*/

        }
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
    .view-tt {
        font-size: 16px;
        line-height: 45px;
        text-align: center;
    }
    .new-message-count-tip {
        position: absolute;
        right: 10px;
        bottom: 10px;
        padding: 2px 12px;
        background-color: lighten(#54bae2, 10%);
        color: #fff;
        font-size: 12px;
        border-radius: 10px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        .bubble-down {
            position: absolute;
            width: 0;
            height: 0;
            bottom: -4px;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-top: 4px solid lighten(#54bae2, 10%);
        }
        &:hover {
            background-color: #54bae2;
            .bubble-down {
                border-top: 4px solid #54bae2;
            }
        }
    }
</style>
