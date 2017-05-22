<template>
  <div class="zpm-im">
    <session></session>
    <chat></chat>
  </div>
</template>

<script>
  import Session from './session/Session.vue'
  import Chat from './chat/Chat.vue'
export default {
  components: {
    Session,
    Chat
  },
  created: function () {
    console.log(this)
  }
}
</script>

<style scoped lang="scss">
  .zpm-im {
    position: relative;
    width: 1000px;
    height: 770px;
    /*border: 1px solid #ddd;*/
    background-color: #fff;
  }
</style>
