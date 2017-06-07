<template>
  <div id="app">
    <router-view></router-view>
    <transition name="loading-transition" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div class="zpm-loading" v-if="state.loading">
        <img src="../../static/loading.gif" alt="加载中">
      </div>
    </transition>
    <div id="global-tip-container">
      <com-toast v-for="(value, item) in globalTips" :key="item" :data-id="item" :data-opts="globalTips[item]"></com-toast>
    </div>
  </div>
</template>

<script>
  import ComToast from './ComToast/ComToast.vue'
  require('../util/directives')
  const types = require('../store/mutation-types')
  export default {
    computed: {
      state () {
        return this.$store.state
      }
    },
    created () {
      this.$store.dispatch('socket_connect')
//      this.$store.dispatch('socket_publish', {
//        conversationType: 1
//      })
//      this.$store.commit(types.SOCKET_GET_CONVERSATION_LIST, {
//        conversationType: 1
//      })
    },
    components: {
      ComToast
    }
  }
</script>

<style lang="scss">
  @import "../../static/css/animate.css";
  @import "../../static/css/icons.css";
  * {
      margin: 0;
      padding: 0;
      outline: 0;
  }
  html, body {
      height: 100%;
  }
body {
  margin: 0;
  /*font-size: 2rem;*/
  font-family: -apple-system, BlinkMacSystemFont,
               'avenir next', avenir,
               helvetica, 'helvetica neue',
               Ubuntu,
               'segoe ui', arial,
               sans-serif;
  background-color: #e7ebf3;
}
#app {
    height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;
}
  .zpm-loading {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    img {
      width: 80px;
      /*height: 31px;*/
    }
  }

  /* 设置滚动条的样式 */
  ::-webkit-scrollbar {
    width: 5px;
  }
  /* 滚动槽 */
  :hover::-webkit-scrollbar-track {
    -webkit-box-shadow:inset 0 0 2px rgba(0,0,0,0.3);
    border-radius:10px;
  }
  /* 滚动条滑块 */
  :hover::-webkit-scrollbar-thumb {
    border-radius:10px;
    background-color: #839bbf;
    /*background: #c8c8c8;*/
    /*background:rgba(0,0,0,0.1);
    -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.5);*/
  }
  ::-webkit-scrollbar-thumb:window-inactive {
    /*background:rgba(255,0,0,0.4);*/
  }

  img {
    background-color: #ffffff!important;
  }

  .msg-item.left {
    width: 80%;
    min-height: 30px;
    overflow-x: hidden;
    overflow-y: auto;
    font-size: 14px;
    padding: 10px 0;
    .user-icon {
      width: 32px;
      height: 32px;
      display: inline-block;
      vertical-align: top;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .msg-right-container {
      display: inline-block;
      vertical-align: top;
      margin-left: 8px;
      max-width: 80%;
      .user-name {
        font-size: 12px;
        line-height: 1.5;
      }
      .msg-content {
        position: relative;
        padding: 6px 8px;
        background-color: lightblue;
        border-radius: 4px;
        word-wrap: break-word;
        word-break: break-all;
        display: inline-block;
        min-height: 19px;
        &.msg-content-custom {
          padding: 1px;
        }
        img {
          width: 100%;
          height: auto;
          vertical-align: middle;
        }
        .bubble-arrow {
          position: absolute;
          z-index: 0;
          left: -6px;
          top: 8px;
          width: 0;
          height: 0;
          margin-left: 0;
          margin-top: 0;
          /*
          -webkit-transform: rotate(20deg);
          -moz-transform: rotate(20deg);
          -ms-transform: rotate(20deg);
          -o-transform: rotate(20deg);
          transform: rotate(20deg);

          border-left: 8px solid transparent;
          border-top: 8px solid lightblue;
          border-right: 8px solid lightblue;
          border-bottom: 8px solid transparent;
          */
          border-top: 4px solid transparent;
          border-bottom: 4px solid transparent;
          border-right: 6px solid lightblue;
        }
        .bubble-arrow-white {
          position: absolute;
          z-index: 0;
          left: -5px;
          top: 9px;
          width: 0;
          height: 0;
          margin-left: 0;
          margin-top: 0;
          border-top: 3px solid transparent;
          border-bottom: 3px solid transparent;
          border-right: 6px solid #ffffff;
        }
        .content-text {
          font-size: 14px;
          -ms-word-wrap: break-word;
          word-wrap: break-word;
          -ms-word-break: break-all;
          word-break: break-all;
          white-space: pre-wrap;
          text-align: justify;
          line-height: 26px;
        }
      }
    }
    .msg-status {
      display: inline-block;
      padding: 0 4px;
      font-size: 10px;
      height: 17px;
      margin-top: 7px;
      border-radius: 4px;
      /*background-color: #ddd;*/
      /*color: #444;*/
      color: #888;
    }
    .msg-status-loading {
      display: inline-block;
      width: 30px;
      height: 30px;
      img {
        margin-left: 7.5px;
        margin-top: 7.5px;
      }
    }
  }
  .msg-item.right {
    width: 80%;
    min-height: 30px;
    overflow: hidden;
    font-size: 14px;
    float: right;
    padding: 10px 0;
    .user-icon {
      width: 32px;
      height: 32px;
      display: inline-block;
      vertical-align: top;
      float: right;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .msg-right-container {
      display: inline-block;
      vertical-align: top;
      margin-right: 8px;
      max-width: 80%;
      float: right;
      .user-name {
        text-align: right;
        font-size: 12px;
        line-height: 1.5;
      }
      .msg-content {
        position: relative;
        padding: 6px 8px;
        background-color: #DDDDDD;
        border-radius: 4px;
        word-wrap: break-word;
        word-break: break-all;
        display: inline-block;
        float: right;
        min-height: 19px;
        &.msg-content-custom {
          padding: 1px;
        }
        img {
          width: 100%;
          height: auto;
          vertical-align: middle;
        }
        .bubble-arrow {
          position: absolute;
          z-index: 0;
          right: -6px;
          top: 8px;
          width: 0;
          height: 0;
          margin-left: 0;
          margin-top: 0;
          /*
          -webkit-transform: rotate(-20deg);
          -moz-transform: rotate(-20deg);
          -ms-transform: rotate(-20deg);
          -o-transform: rotate(-20deg);
          transform: rotate(-20deg);
          border-right: 8px solid transparent;
          border-top: 8px solid #DDDDDD;
          border-left: 8px solid #DDDDDD;
          border-bottom: 8px solid transparent;
          */
          border-left: 6px solid #DDDDDD;
          border-top: 4px solid transparent;
          border-bottom: 4px solid transparent;
        }
        .bubble-arrow-white {
          position: absolute;
          z-index: 0;
          right: -5px;
          top: 9px;
          width: 0;
          height: 0;
          margin-left: 0;
          margin-top: 0;
          border-left: 6px solid white;
          border-top: 3px solid transparent;
          border-bottom: 3px solid transparent;
        }
        .content-text {
          font-size: 14px;
          -ms-word-wrap: break-word;
          word-wrap: break-word;
          -ms-word-break: break-all;
          word-break: break-all;
          white-space: pre-wrap;
          text-align: justify;
          line-height: 26px;
        }
      }
    }
    .msg-status {
      display: inline-block;
      float: right;
      margin-right: 4px;
      padding: 0 4px;
      font-size: 10px;
      height: 17px;
      margin-top: 7px;
      border-radius: 4px;
      /*background-color: #ddd;*/
      /*color: #444;*/
      color: #888;
    }
    .msg-status-loading {
      display: inline-block;
      float: right;
      width: 30px;
      height: 30px;
      img {
        margin-left: 7.5px;
        margin-top: 7.5px;
      }
    }
    .msg-send-error {
      display: inline-block;
      float: right;
      line-height: 31px;
      margin-right: 5px;
      color: red;
    }
  }


  .datepicker-overlay {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 998;
    top: 0;
    left: 0;
    overflow: hidden;
    -webkit-animation: fadein 0.5s;
    /* Safari, Chrome and Opera > 12.1 */
    -moz-animation: fadein 0.5s;
    /* Firefox < 16 */
    -ms-animation: fadein 0.5s;
    /* Internet Explorer */
    -o-animation: fadein 0.5s;
    /* Opera < 12.1 */
    animation: fadein 0.5s;
  }
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  /* Firefox < 16 */
  @-moz-keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  /* Safari, Chrome and Opera > 12.1 */
  @-webkit-keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  /* Internet Explorer */
  @-ms-keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  /* Opera < 12.1 */
  @-o-keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .cov-date-body {
    display: inline-block;
    background: #3F51B5;
    overflow: hidden;
    position: relative;
    font-size: 16px;
    font-family: 'Roboto';
    font-weight: 400;
    position: fixed;
    display: block;
    width: 400px;
    max-width: 100%;
    z-index: 999;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
  }
  .cov-picker-box {
    background: #fff;
    width: 100%;
    display: inline-block;
    padding: 25px;
    box-sizing: border-box !important;
    -moz-box-sizing: border-box !important;
    -webkit-box-sizing: border-box !important;
    -ms-box-sizing: border-box !important;
    width: 400px;
    max-width: 100%;
    height: 280px;
    text-align: start!important;
  }
  .cov-picker-box td {
    height: 34px;
    width: 34px;
    padding: 0;
    line-height: 34px;
    color: #000;
    background: #fff;
    text-align: center;
    cursor: pointer;
  }
  .cov-picker-box td:hover {
    background: #E6E6E6;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
  }
  .day {
    width: 14.2857143%;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    height: 34px;
    padding: 0;
    line-height: 34px;
    color: #000;
    background: #fff;
    vertical-align: middle;
  }
  .week ul {
    margin: 0 0 8px;
    padding: 0;
    list-style: none;
  }
  .week ul li {
    width: 14.2%;
    display: inline-block;
    text-align: center;
    background: transparent;
    color: #000;
    font-weight: bold;
  }
  .passive-day {
    color: #bbb;
  }
  .checked {
    background: #F50057;
    color: #FFF !important;
    border-radius: 3px;
  }
  .unavailable {
    color: #ccc;
    cursor: not-allowed;
  }
  .cov-date-monthly {
    height: 150px;
  }
  .cov-date-monthly > div {
    display: inline-block;
    padding: 0;
    margin: 0;
    vertical-align: middle;
    color: #fff;
    height: 150px;
    float: left;
    text-align: center;
    cursor: pointer;
  }
  .cov-date-previous,
  .cov-date-next {
    position: relative;
    width: 20% !important;
    text-indent: -300px;
    overflow: hidden;
    color: #fff;
  }
  .cov-date-caption {
    width: 60%;
    padding: 50px 0!important;
    box-sizing: border-box;
    font-size: 24px;
  }
  .cov-date-caption span:hover {
    color: rgba(255, 255, 255, 0.7);
  }
  .cov-date-previous:hover,
  .cov-date-next:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  .day:hover {
    background: #EAEAEA;
  }
  .unavailable:hover {
    background: none;
  }
  .checked:hover {
    background: #FF4F8E;
  }
  .cov-date-next::before,
  .cov-date-previous::before {
    width: 20px;
    height: 2px;
    text-align: center;
    position: absolute;
    background: #fff;
    top: 50%;
    margin-top: -7px;
    margin-left: -7px;
    left: 50%;
    line-height: 0;
    content: '';
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    transform: rotate(45deg);
  }
  .cov-date-next::after,
  .cov-date-previous::after {
    width: 20px;
    height: 2px;
    text-align: center;
    position: absolute;
    background: #fff;
    margin-top: 6px;
    margin-left: -7px;
    top: 50%;
    left: 50%;
    line-height: 0;
    content: '';
    -webkit-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
  .cov-date-previous::after {
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    transform: rotate(45deg);
  }
  .cov-date-previous::before {
    -webkit-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
  .date-item {
    text-align: center;
    font-size: 20px;
    padding: 10px 0;
    cursor: pointer;
  }
  .date-item:hover {
    background: #e0e0e0;
  }
  .date-list {
    overflow: auto;
    vertical-align: top;
    padding: 0;
  }
  .cov-vue-date {
    display: inline-block;
    color: #5D5D5D;
  }
  .button-box {
    background: #fff;
    vertical-align: top;
    height: 50px;
    line-height: 50px;
    text-align: right;
    padding-right: 20px;
  }
  .button-box span {
    cursor: pointer;
    padding: 10px 20px;
  }
  .watch-box {
    height: 100%;
    overflow: hidden;
  }
  .hour-box,
  .min-box {
    display: inline-block;
    width: 50%;
    text-align: center;
    height: 100%;
    overflow: auto;
    float: left;
  }
  .hour-box ul,
  .min-box ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .hour-item,
  .min-item {
    padding: 10px;
    font-size: 36px;
    cursor: pointer;
  }
  .hour-item:hover,
  .min-item:hover {
    background: #E3E3E3;
  }
  .hour-box .active,
  .min-box .active {
    background: #F50057;
    color: #FFF !important;
  }
  /*::-webkit-scrollbar {*/
    /*width: 2px;*/
  /*}*/
  /*::-webkit-scrollbar-track {*/
    /*background: #E3E3E3;*/
  /*}*/
  /*::-webkit-scrollbar-thumb {*/
    /*background: #C1C1C1;*/
    /*border-radius: 2px;*/
  /*}*/

  #global-tip-container {
    position: fixed;
    width: 300px;
    /*min-height: 300px;*/
    right: 10px;
    top: 48px;
    z-index: 99999;
    /*overflow-y: hidden;*/
    background-color: transparent;
    .item {
      width: 100%;
      /*height: 48px;*/
      line-height: 2;
      margin-top: 10px;
      padding: 10px;
      border-radius: 5px;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      -khtml-user-select: none;
      user-select: none;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      i {
        width: 20px;
        height: 20px;
        font-size: 20px;
        cursor: pointer;
      }
      &.success {
        color: #ffffff;
        background-color: #5cb85c;
        border: 1px solid #4cae4c;
      }
      &.info {
        color: #ffffff;
        background-color: #5bc0de;
        border: 1px solid #46b8da;
      }
      &.warning {
        color: #ffffff;
        background-color: #f0ad4e;
        border: 1px solid #eea236;
      }
      &.danger, &.error {
        color: #ffffff;
        background-color: #d9534f;
        border: 1px solid #d43f3a;
      }
    }
  }
</style>
