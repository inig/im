<template>
    <div class="zpm-chat-container">
        <transition name="chat-transition" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <div class="zpm-chat" v-if="currentAccount!='' && currentSession!='' && !!session">
                <chat-header></chat-header>
                <chat-view></chat-view>
                <chat-edit></chat-edit>
            </div>
        </transition>
        <transition name="chat-empty-transition" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <div class="zpm-chat empty" v-if="currentAccount=='' || currentSession=='' || !session">
                <img src="../../../../static/empty_dialogue.png">
                <p>有趣的灵魂终会相遇~</p>
            </div>
        </transition>
        <transition name="send-interview-transition" enter-active-class="animated-p3 fadeIn" leave-active-class="animated-p3 fadeOut">
            <send-interview v-if="sendInterviewShown"></send-interview>
        </transition>
    </div>
</template>

<script>
  import ChatHeader from './ChatHeader.vue'
  import ChatView from './ChatView.vue'
  import ChatEdit from './ChatEdit.vue'
  import SendInterview from './custom/SendInterview.vue'
  export default {
    data () {
      return {
        sendInterviewShown: false
      }
    },
    created () {
      if (!this.$store.hasOwnProperty('vms')) {
        this.$store.vms = {}
      }
      this.$store.vms.chat = this
    },
    computed: {
      showSendInterview () {
        this.sendInterviewShown = true
      },
      hideSendInterview () {
        this.sendInterviewShown = false
      },
      toggleSendInterview () {
        this.sendInterviewShown = !this.sendInterviewShown
      },
      msgs () {
        return this.$store.state.msgs
      },
      messages: function () {
        return this.msgs[this.currentSession] || []
      },
      session () {
        return this.$store.state.jobInfo
      },
      currentAccount () {
        return this.$store.state.currentaccount
      },
      currentSession () {
        return this.$store.state.currentsession
      }
    },
    components: {
      ChatHeader,
      ChatView,
      ChatEdit,
      SendInterview
    }
  }
</script>

<style lang="scss">
    .zpm-chat-container {
        position: relative;
        width: 735px;
        height: 770px;
        float: left;
        border-left: 1px solid #ddd;
        background-color: #fff;
    }
    .zpm-chat {
        width: 100%;
        height: 100%;
        &.empty {
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            img {
                width: 170px;
                height: 170px;
            }
            p {
                margin-top: 18px;
                text-align: center;
                font-size: 14px;
                color: #839bbf;
            }
        }
    }
</style>
