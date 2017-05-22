<template>
    <div class="counter-wrapper">
        <div class="counter">
            {{ count }}
        </div>
        <div class="messages">
            <div class="item" v-for="(msg, index) in messages" :key="msg" v-text="msg"></div>
        </div>
        <input type="text" v-model="cacheMessage">
        <button type="button" @click="sendMessage()">发送消息</button>
        <button @click="increment()">Increment</button>
        <button @click="decrement()">Decrement</button>
        <button @click="$store.dispatch('incrementAsync')">Increment Async</button>
    </div>
</template>

<script>
  const types = require('../store/mutation-types')
  export default {
    data () {
      return {
        cacheMessage: ''
      }
    },
    created: function () {
      console.log('>>>>>>>>', this.$store)
    },
    computed: {
      count() {
        return this.$store.state.counter.count
      },
      messages() {
        return this.$store.state.messages.messages
      }
    },
    methods: {
      increment: function () {
        this.$store.commit(types.INCREMENT_COUNT)
      },
      decrement: function () {
        this.$store.commit(types.DECREMENT_COUNT)
      },
      sendMessage: function () {
        this.$store.commit(types.ADD_MESSAGE, this.cacheMessage)
        this.cacheMessage = ''
      }
    }
  }
</script>

<style>
    .counter {
        margin: 100px auto;
        border-radius: 3px;
        width: 200px;
        height: 200px;
        text-align: center;
        line-height: 200px;
        font-size: 5rem;
        background-color: #f0f0f0;
        user-select: none;
    }
</style>
