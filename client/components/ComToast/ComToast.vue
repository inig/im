<template>
  <transition name="tip-transition" :enter-active-class="'animated ' + dataOpts.animationIn" :leave-active-class="'animated ' + dataOpts.animationOut">
    <div class="tip-item" :class="dataOpts.type" :ref="dataId" v-if="shown">
      <div class="type-icon">
        <div v-if="dataOpts.type=='success'">
          <md-icon>check</md-icon>
        </div>
        <div v-if="dataOpts.type=='info'">
          <md-icon>info</md-icon>
        </div>
        <div v-if="dataOpts.type=='error'">
          <md-icon>cancel</md-icon>
        </div>
        <div v-if="dataOpts.type=='warning'">
          <md-icon>warning</md-icon>
        </div>
        <p v-text="dataOpts.message"></p>
      </div>
      <div class="close" v-if="dataOpts.cancel" @click="closeTip">
        <md-icon>close</md-icon>
      </div>
    </div>
  </transition>
</template>

<script>
  import * as types from '../../store/mutation-types'
  export default {
    props: ['dataOpts', 'dataId'],
    data () {
      return {
        shown: false
      }
    },
    created () {
      const that = this
      setTimeout(function () {
        that.shown = true
      }, 1)

      if (!this.$store.hasOwnProperty('vms')) {
        this.$store.vms = {}
      }
      this.$store.vms[this.dataId] = this
    },
    methods: {
      closeTip () {
        this.$store.commit(types.DEL_TIP, {
          id: this.dataId
        })
      }
    }
  }
</script>

<style lang="scss">
  .tip-item {
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
    .type-icon {
      display: inline-flex;
      align-items: flex-start;
      justify-content: flex-start;
      p {
        margin-left: 10px;
        white-space: pre-wrap;
        word-break: break-all;
      }
    }
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
</style>
