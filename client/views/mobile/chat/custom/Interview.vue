<template>
  <div class="component-interview">
    <div class="interview-header">
      <p>面试邀请</p>
    </div>
    <div class="interview-body">
      <div class="interview-item">
        <!--<i class="fa fa-fw fa-clock-o"></i>-->
        <i class="detail-icon im-icon icon-time"></i>
        <div class="color-important" data-format="YYYY年MM月DD日 H:m" :data-value="message.message.date" v-time-format></div>
      </div>
      <div class="interview-item h28">
        <!--<i class="fa fa-fw fa-map-marker"></i>-->
        <i class="detail-icon im-icon icon-address"></i>
        <div class="text-ellipse" v-text="message.message.address" :title="message.message.address"></div>
      </div>
      <div class="interview-item">
        <!--<i class="fa fa-fw fa-phone"></i>-->
        <i class="detail-icon im-icon icon-phone"></i>
        <div>
          <span v-text="message.message.tel"></span>
          <span class="ml8" v-text="message.message.contact"></span>
        </div>
      </div>
      <div class="interview-item">
        <!--<i class="fa fa-fw fa-file"></i>-->
        <i class="detail-icon im-icon icon-file"></i>
        <div class="text-ellipse-3" v-text="message.message.desc"></div>
      </div>
    </div>
    <div class="interview-footer">
      <p>等待TA接受...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Interview',
  data () {
    return {
      message: this.$parent.message
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .component-interview {
    width: 280px;
    height: auto;
    background-color: #ffffff;
    border-radius: 4px;
    .interview-header {
      line-height: 35px;
      font-size: 14px;
      color: rgba(51, 51, 51, 1);
      padding: 0 15px;
    }
    .interview-body {
      background-color: rgba(233, 237, 246, 1);
      color: rgba(87, 88, 90, 1);
      padding: 0 15px;
      .interview-item {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        line-height: 28px;
        white-space: nowrap;
        i {
          color: rgba(165, 174, 193, 1);
          width: 30px;
          float: left;
          margin-top: 2px;
          text-align: left;
        }
        div {
          width: 230px;
          display: inline-block;
        }
      }
    }
    .interview-footer {
      line-height: 40px;
      color: rgba(167, 167, 167, 1);
      padding: 0 15px;
      /*color: rgba(153, 198, 74, 1);*/
    }
  }
  .color-important {
    color: #54bae2;
  }
  .text-ellipse {
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .h28 {
    height: 28px;
  }

  .text-ellipse-3 {
    white-space: normal;
    max-height: 84px;
    overflow: hidden;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    position: relative;
    /*-ms-word-wrap: break-word;*/
    /*word-wrap: break-word;*/
    /*-ms-word-break: break-all;*/
    /*word-break: break-all;*/
    /*white-space: pre-wrap;*/
  }
  /*.text-ellipse-3::after {*/
    /*content: '...';*/
    /*position: absolute;*/
    /*width: 19px;*/
    /*bottom: 0;*/
    /*right: 0;*/
    /*background-color: #e9edf6;*/
  /*}*/
</style>
