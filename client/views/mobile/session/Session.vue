<template>
  <div class="zpm-session-container">
    <transition name="session-transition" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div class="zpm-session" v-if="sessions.length > 0">
        <transition name="session-tip-transition" enter-active-class="animated bounceIn" leave-active-class="animated fadeOut">
          <div class="session-notice" v-if="tipShown">
            <p>联系人超过7天没有发送消息，系统自动放入“<a href="javascript:">全部约聊记录</a>”中</p>
            <b class="notice-close" @click="closeSessionTip">×</b>
          </div>
        </transition>
        <div class="session-list" :class="!tipShown ? 'long' : ''">
          <div class="session-list-normal">
            <!-- 普通会话列表 (非置顶状态) -->
            <div class="list-wrapper" v-for="(value, item) in sessionList" :key="item" :style="{'height': (32 + value.length*94) + 'px'}">
              <div class="group-title" @click="toggleGroup($event)">
                <i class="im-icon icon-down"></i>
                <span class="title-name" v-text="item"></span>
              </div>
              <div class="list-item" v-for="(session, index) in value" :key="session" :class="session.conversationid == currentSession ? 'active' : ''" :data-group-name="item" :data-index="index" :data-session-id="session.conversationid" :data-to="sessionMembers[session.conversationid] && sessionMembers[session.conversationid][0].userId" @mouseenter="mouseEntered($event)" @mouseleave="mouseLeaved($event)" @click="activeSession($event)">
                <div class="item-info">
                  <div class="info-avatar"></div>
                  <div class="info-nick" v-html="sessionMembers[session.conversationid] && sessionMembers[session.conversationid][0].userId"></div>
                  <div class="info-time" :data-value="session.sendTime || session.sendtime || session.receivedtimestamp" v-session-time></div>
                </div>
                <session-item :data-session-id="session.conversationid" :data-title="item" :data-index="index"></session-item>
                <span class="item-btn-del" @click="removeSession($event)">×</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="session-empty-transition" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div class="zpm-session empty" v-if="sessions.length == 0">
        <img src="../../../../static/empty_dialogue_list.png">
        <p>有趣的灵魂终会相遇</p>
      </div>
    </transition>
  </div>
</template>

<script>
  import * as types from '../../../store/mutation-types'
  import SessionItem from './SessionItem.vue'
export default {
  data () {
    return {
      tipShown: true
    }
  },
  created: function () {
    if (!this.$store.hasOwnProperty('vms')) {
      this.$store.vms = {}
    }
    this.$store.vms.sessionList = this
  },
  computed: {
    currentAccount () {
      return this.$store.state.currentaccount
    },
    currentSession () {
      return this.$store.state.currentsession
    },
    sessions () {
      return this.$store.state.sessions
    },
    sessionMembers: function () {
      return this.$store.state.sessionMembers
    },
    sessionList: function () {
      const map = {}
      let item
      const sessions = this.$store.state.sessions
      for (let i = 0; i < sessions.length; i++) {
        item = sessions[i]
        if (map.hasOwnProperty(item.title)) {
          map[item.title].push(item)
        } else {
          map[item.title] = [item]
        }
      }
      return map
    }
  },
  methods: {
    closeSessionTip: function () {
      this.tipShown = false
    },
    mouseEntered: function (target) {
      let _targetClassList = target.target.classList
      !_targetClassList.contains('in') && _targetClassList.add('in')
    },
    mouseLeaved: function (target) {
      let _targetClassList = target.target.classList
      _targetClassList.contains('in') && _targetClassList.remove('in')
    },
    activeSession: function (target) {
      const that = this
      if (target.target.classList.contains('list-item')) {
        let _conversationid = target.target.dataset.sessionId
        this.$store.commit(types.SET_CURRENT_SESSION_INFO, this.sessionList[target.target.dataset.groupName][Number(target.target.dataset.index)])
        this.$store.commit(types.SET_CURRENT_SESSION, {
          id: _conversationid,
          to: target.target.dataset.to
        })
        if (this.$store.state.unreadCount.hasOwnProperty(_conversationid) && Number(this.$store.state.unreadCount[_conversationid]) > 0) {
          this.$store.dispatch('socket_clearConversationUnreadCount', {
            conversationType: 1,
            targetId: _conversationid
          })
        }
        this.$router.go('http://www.baidu.com')
        setTimeout(function () {
          that.$store.commit(types.DO_SCROLL)
        }, 100)
//        if (!this.$store.state.msgs.hasOwnProperty(_conversationid)) {
//          this.$store.dispatch('socket_getHistoryMessage', {
//            'targetId': _conversationid,
//            'conversationType': 1,
//            'timestap': (+new Date() - 1 * 12 * 30 * 24 * 60 * 60 * 1000),
//            'count': 99999,
//            'direction': 0
//          })
//        }
      }
    },
    removeSession: function (target) {
      // TODO: 删除当前会话
      alert('删除当前会话')
    },
    toggleGroup: function (target) {
      /***
       * 展开或关闭当前分组
       */
      let _listWrapper = target.target.parentNode
      if (_listWrapper.classList.contains('closed')) {
        _listWrapper.classList.remove('closed')
      } else {
        _listWrapper.classList.add('closed')
      }
    }
  },
  components: {
    SessionItem
  }
}
</script>

<style scoped lang="scss">
  .zpm-session-container {
    position: relative;
    width: 100%;
    height: 100%;
    float: left;
    background-color: #fff;
    .zpm-session {
      width: 100%;
      height: 100%;
      &.empty {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        img {

        }
        p {
          margin-top: 18px;
          text-align: center;
          font-size: 14px;
          color: #839bbf;
        }
      }
      .session-notice {
        padding: 5px 12px;
        background-color: #fff5e5;
        color: #d28915;
        font-size: 12px;
        line-height: 18px;
        position: relative;
        a {
          text-decoration: none;
          color: #0098d4;
        }
        .notice-close {
          position: absolute;
          cursor: pointer;
          top: 4px;
          right: 2px;
          display: inline-block;
          width: 20px;
          height: 20px;
          text-align: center;
          font-size: 14px;
          line-height: 20px;
        }
      }
      .session-list {
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        &.long {
          height: 100%;
        }
        .session-list-normal {
          width: 100%;
          .list-wrapper {
            overflow: hidden;
            -webkit-transition: all .3s cubic-bezier(0.215,.61,.355,1);
            -moz-transition: all .3s cubic-bezier(0.215,.61,.355,1);
            -ms-transition: all .3s cubic-bezier(0.215,.61,.355,1);
            -o-transition: all .3s cubic-bezier(0.215,.61,.355,1);
            transition: all .3s cubic-bezier(0.215,.61,.355,1);
            &.closed {
              height: 32px!important;
              .group-title {
                i {
                  width: 25px;
                  height: 25px;
                  background-position: -75px -25px;
                }
              }
            }
            .group-title {
              padding: 0 5px 0 20px;
              height: 32px;
              line-height: 32px;
              vertical-align: middle;
              font-size: 14px;
              color: #333;
              cursor: pointer;
              i {
                pointer-events: none;
                width: 25px;
                height: 25px;
                background-position: -100px -25px;
              }

              .title-name {
                display: inline-block;
                width: 175px;
                font-size: 16px;
                color: #333;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                vertical-align: middle;
                pointer-events: none;
              }
            }
            .list-item {
              position: relative;
              color: #999;
              cursor: pointer;
              padding-bottom: 14px;
              &.in {
                background-color: #eef8fe;
                .item-btn-del {
                  display: block;
                }
              }
              &.active {
                background-color: #54bae2;
                color: #ffffff;
                .info-nick {
                  color: #ffffff!important;
                }
                .item-btn-del {
                  color: #ffffff;
                }
              }
              .item-info {
                position: relative;
                padding: 14px 20px 6px;
                zoom: 1;
                line-height: 40px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                pointer-events: none;
                .info-avatar {
                  width: 40px;
                  height: 40px;
                  background-size: 100% 100%;
                  background-repeat: no-repeat;
                  background-image: url('../../../../static/male@2x.png');
                }
                .info-nick {
                  width: 114px;
                  height: 40px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  font-size: 16px;
                  color: #333;
                }
                .info-time {
                  width: 60px;
                  height: 40px;
                  overflow: hidden;
                  font-size: 14px;
                  text-align: right;
                }
              }
              .item-btn-del {
                position: absolute;
                top: 27px;
                left: 2px;
                display: none;
                width: 14px;
                height: 14px;
                line-height: 14px;
                text-align: center;
                font-size: 14px;
                color: #9c9c9c;
              }
            }
          }
        }
      }
    }
  }
</style>
