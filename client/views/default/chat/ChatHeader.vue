<template>
  <div class="chat-header">
    <p class="info-name" v-text="currentAccount + '-' + session.title"></p>
    <div class="user-info">
      <div class="info-avatar"></div>
      <div class="info-detail">
        <p>
          <span v-text="currentAccount"></span>
          <span>女</span>
          <span>日喀则</span>
          <span>本科</span>
          <span>3-5年</span>
          <b>1千以下</b>
        </p>
        <p>
          <span>手机号码：18500001005</span>
          <span>邮箱：1851005@qq.com</span>
        </p>
      </div>
    </div>
    <div class="info-setting im-icon icon-setting1"></div>
  </div>
</template>

<script>
export default {
  computed: {
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
  }
}
</script>

<style lang="scss">
  .chat-header {
    padding: 16px 20px;
    color: #333;
    position: relative;
    background-color: #edf1f8;
    z-index: 9;
    zoom: 1;
    height: 74px;
    .info-name {
      overflow: hidden;
      margin-bottom: 6px;
      width: 650px;
      font-size: 16px;
      line-height: 20px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .user-info {
      width: 100%;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .info-avatar {
        width: 48px;
        height: 48px;
        border-radius: 24px;
        overflow: hidden;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-image: url("../../../../static/male@2x.png");
      }
      .info-detail {
        width: 100%;
        height: 48px;
        padding-left: 15px;
        p {
          font-size: 12px;
          line-height: 12px;
          color: #333;
          margin-top: 8px;
          span {
            margin-right: 8px;
          }
          b {
            margin-right: 8px;
            font-weight: 400;
            color: #fa6460;
          }
        }
      }
    }
    .info-setting {
      position: absolute;
      top: 10px;
      right: 20px;
      width: 25px;
      height: 25px;
      cursor: pointer;
      z-index: 9;
    }
    .im-icon {
      &.icon-setting1 {
        width: 25px;
        height: 25px;
        background-position: -50px 0;
        &:hover {
          background-position: -50px -150px;
        }
      }
    }
  }
</style>
