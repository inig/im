<template>
    <div class="chat-edit">
        <div class="edit-btns">
            <!--<span class="btns-emoji im-icon icon-emoji"></span>-->
            <!--<span class="btns-pic im-icon icon-pic"></span>-->
            <span class="btns-btn btn-quickReply" @click="toggleQuickReplyContainer">快速回复</span>
            <!--<span class="btns-btn">发送职位</span>-->
            <span class="btns-btn" @click="showSendInterview">发送面试邀请函</span>
        </div>
        <textarea class="edit-input" v-model="text" placeholder="请输入聊天内容" @input="limitInput"></textarea>
        <div class="edit-sender">
            <div class="edit-count">
                <b v-text="text.length"></b>/<span v-text="maxInput"></span>
            </div>
            <div class="edit-sender-right">
                <div class="edit-tip">按下Ctrl+Enter发送</div>
                <span class="edit-send" data-message-type="1" @click="send($event)">发送</span>
            </div>
        </div>
        <transition name="quick-reply-transition" enter-active-class="animated-p3 fadeIn" leave-active-class="animated-p3 fadeOut">
            <div class="quick-reply-container" ref="quickReply" v-if="quickReply.shown">
                <i class="im-icon icon-arrowDown"></i>
                <div class="reply-list">
                    <div class="reply-item" v-for="(item, index) in quickReply.content" :key="item" v-text="item" :data-index="index" @click="chooseReply($event)"></div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import * as types from '../../../store/mutation-types'
    import { getUnique, containsNode } from '../../../util'
  export default {
    data () {
      return {
        text: '',
        quickReply: {
          shown: false,
          content: [
            '您好，感觉您比较符合我们的职位要求，方便聊一聊吗？',
            '抱歉，您与我们的职位不太匹配，祝您早日找到满意的工作~',
            '很抱歉，暂时不再招人了~',
            '您的电话打不通，感觉您比较符合我们的职位，方便时请回复消息~',
            '什么时候方便过来面试吗？'
          ]
        }
      }
    },
    created: function () {
      const that = this
      if (!this.$store.hasOwnProperty('vms')) {
        this.$store.vms = {}
      }
      this.$store.vms.chatEdit = that
      function keyDownEvent (evt) {
        let keyCode = evt.keyCode || evt.which || evt.charCode
        let ctrlKey = evt.ctrlKey || evt.metaKey
        if (ctrlKey && keyCode === 13) {
          that.send()
        }
      }
      window.addEventListener('keydown', keyDownEvent, false)
    },
    computed: {
      session () {
        return this.$store.state.jobInfo
      },
      currentAccount () {
        return this.$store.state.currentaccount
      },
      currentSession () {
        return this.$store.state.currentsession
      },
      maxInput () {
        return this.$store.state.maxInput
      }
    },
    methods: {
      chooseReply (target) {
        this.text = this.quickReply.content[Number(target.target.dataset.index)]
        this.hideQuickReplyContainer()
        this.send()
      },
      send (target, opts) {
        /***
         * 发送消息
         */
        let _msgType
        if (target) {
          _msgType = Number(target.target.dataset.messageType)
        } else {
          if (opts && opts.hasOwnProperty('msgType')) {
            _msgType = Number(opts.msgType)
          } else {
            _msgType = 1
          }
        }
        let _unique = getUnique()
        let _now = (+new Date())
        let _message = {}
        const text = this.text
        switch (_msgType) {
          case 1:
            // 发送文本消息
            _message = {
              from: this.$store.state.account,
              to: this.currentSession,
              conversationType: 1,
              msgType: _msgType,
              message: text,
              sendTime: _now,
              sender: this.$store.state.account,
              readers: [this.$store.state.account],
              unique: _unique
            }
            break
          case 2:
            // 发送面试邀请函
            _message = {
              from: this.$store.state.account,
              to: this.currentSession,
              conversationType: 1,
              msgType: 2,
              readers: [this.$store.state.account],
              sender: this.$store.state.account,
              unique: _unique,
              message: {
                customType: opts.customType,
                date: opts.date || _now,
                address: opts.address,
                tel: opts.tel,
                contact: opts.contact,
                desc: opts.desc
              }
            }
            break
          default:
            break
        }
        if (!this.$store.state.sendingQueue.hasOwnProperty(_unique) && (_msgType === 1 ? text.trim() : true)) {
          console.log('****** send *******', _unique)
          this.$store.state.sendingQueue[_unique] = {
            times: 1,
            message: _message
          }
          this.$store.state.msgs[this.$store.state.currentsession].push(_message)
          this.$store.dispatch('socket_sendMessage', {
            times: 1,
            message: _message
          })
          this.text = ''
        }
      },
      limitInput () {
        /***
         * 限制消息的长度
         */
        if (this.text.length > this.maxInput) {
          this.text = this.text.substring(0, this.maxInput)
        }
      },
      bodyClickHandler (evt) {
        if (!evt.target.classList.contains('reply-item') && !evt.target.classList.contains('btn-quickReply')) {
          this.hideQuickReplyContainer()
        }
      },
      showQuickReplyContainer () {
        this.quickReply.shown = true
        document.body.addEventListener('click', this.bodyClickHandler, false)
      },
      hideQuickReplyContainer () {
        this.quickReply.shown = false
        document.body.removeEventListener('click', this.bodyClickHandler)
      },
      toggleQuickReplyContainer () {
        if (this.quickReply.shown) {
          this.hideQuickReplyContainer()
        } else {
          this.showQuickReplyContainer()
        }
      },
      showSendInterview () {
        this.$store.vms.chat.sendInterviewShown = true
      }
    },
    components: {
    }
  }
</script>

<style lang="scss">
    .chat-edit {
        position: relative;
        height: 127px;
        background-color: #fff;
        border-top: 1px solid #dddddd;
        padding: 8px 20px;
        .edit-btns {
            overflow: hidden;
            span {
                margin-right: 8px;
                float: left;
                cursor: pointer;
            }
            .btns-btn {
                position: relative;
                float: left;
                display: inline-block;
                vertical-align: top;
                margin-top: 1px;
                font-size: 12px;
                color: #38aad7;
                line-height: 20px;
                border: 1px solid #38aad7;
                padding: 0 6px;
                border-radius: 3px;
                margin-right: 8px;
                cursor: pointer;
                &:hover {
                    color: #fff;
                    background-color: #38aad7;
                }
            }
        }
        .edit-input {
          overflow-y: auto;
            margin-top: 12px;
            width: 100%;
            height: 44px;
            line-height: 20px;
            -webkit-appearance: none;
            resize: none;
            font-size: 14px;
            outline: none;
            border: none;
        }
        .edit-sender {
            width: 100%;
            height: 40px;
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            .edit-count {
                font-size: 12px;
                color: #999;
                b {
                    color: #54bae2;
                }
            }
            .edit-sender-right {
                display: inline-flex;
                align-items: flex-end;
                justify-content: flex-end;
                .edit-tip {
                    font-size: 12px;
                    color: #999;
                    margin-right: 8px;
                }
                .edit-send {
                    height: 36px;
                    font-size: 14px;
                    line-height: 36px;
                    color: #fff;
                    background-color: #29a9db;
                    padding: 0 25px;
                    border-radius: 5px;
                    cursor: pointer;
                    &:hover {
                        background-color: darken(#29a9db, 10%);
                     }
                }
            }
        }
        .quick-reply-container {
            position: absolute;
            top: -152px;
            left: 0;
            width: 444px;
            height: 150px;
            border: 1px solid #d3dce1;
            border-radius: 3px;
            background-color: #ffffff;
            cursor: pointer;
            i {
                position: absolute;
                /*left: 106px;*/
                left: 40px;
                bottom: -8px;
            }
            .reply-list {
                width: 100%;
                height: 100%;
                .reply-item {
                    display: block;
                    padding-left: 15px;
                    height: 29px;
                    line-height: 29px;
                    border-bottom: 1px solid #d8dde1;
                    font-size: 14px;
                    color: #666;
                    &:last-child {
                        border: none;
                        height: 30px;
                        line-height: 30px;
                    }
                    &:hover {
                        background: #f0f3fb;
                    }
                }
            }
        }
    }
</style>
