<template>
  <div class="zpm-scroll-container" ref="zpmScrollContainer">
    <div class="zpm-scroll-wrapper">
      <div class="pull-refresh" ref="pullDown">
        <i class="pull-down-icon" :style="{transform: 'rotate(' + calcDeg() + 'deg)'}"></i>
        <p class="pull-tip">下拉刷新</p>
      </div>
      <slot></slot>
      <!--<div class="pull-refresh" ref="pullUp">-->
        <!--<i class="pull-up-icon" :style="{transform: 'rotate(' + (calcDeg() + 180) + 'deg)'}"></i>-->
        <!--<p class="pull-tip">上拉加载更多</p>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
  export default {
    name: 'zpmScroll',
    props: ['dataOptions', 'dataNeedPullDown', 'dataNeedPullUp'],
    data () {
      return {
        scroller: null,
        offsetTop: 0
      }
    },
    created: function () {
      if ((this.dataNeedPullDown || this.dataNeedPullUp)) {
        require('./iscroll-probe.js')
      } else {
        require('./iscroll.js')
      }
    },
    mounted: function () {
      const that = this
      document.addEventListener('touchmove', function (e) { e.preventDefault() }, false)

      let _scrollerName = this.dataOptions.scrollerName
      delete this.dataOptions.scrollerName
      this.scroller = new window.IScroll(this.$refs.zpmScrollContainer, Object.assign({
        bounce: true,
        click: false,
        tap: false,
        useTransform: true,
        useTransition: true,
        mouseWheel: true,
        scrollbars: true,
        scrollX: false,
        scrollY: true,
        startX: 0,
        startY: -30,
        fadeScrollbars: true,
        interactiveScrollbars: true,
        shrinkScrollbars: 'scale',
        invertWheelDirection: false,
        momentum: true,
        probeType: 3
      }, this.dataOptions))
      if (!this.$parent.hasOwnProperty('zpmScrollers')) {
        this.$parent.zpmScrollers = {}
      }
      this.$parent.zpmScrollers[_scrollerName] = this.scroller
      this.$emit('ready', this.scroller)
      this.scroller.setRefresh = function () {
        that.$refs.pullDown.querySelector('.pull-down-icon').classList.contains('loading') && that.$refs.pullDown.querySelector('.pull-down-icon').classList.remove('loading')
        that.$refs.pullDown.querySelector('.pull-tip').innerHTML = '下拉刷新'
        setTimeout(function () {
          that.scroller.refresh()
        }, 1)
      }
      if (this.dataNeedPullDown) {
//      if (this.dataNeedPullDown || this.dataNeedPullUp) {
        this.scroller.on('scroll', function () {
          that.offsetTop = Math.floor(this.y)
        })
        this.scroller.on('touchEnd', function () {
          if (that.offsetTop > 30) {
            that.scroller.scrollTo(0, 0, 500)
            !that.$refs.pullDown.querySelector('.pull-down-icon').classList.contains('loading') && that.$refs.pullDown.querySelector('.pull-down-icon').classList.add('loading')
            that.$refs.pullDown.querySelector('.pull-tip').innerHTML = '加载中...'
            that.$emit('pulldown', that.scroller)
          } else if (that.offsetTop < 30 && that.offsetTop > -30) {
            setTimeout(function () {
              that.scroller.scrollTo(0, -34, 500)
            }, 300)
          } else if (that.offsetTop < -30) {}
        })
      }
    },
    methods: {
      calcDeg () {
        let _realTop = this.offsetTop
        let out = 0
        if (_realTop * 6 < 0) {
          out = 0
        } else if (_realTop * 6 < 180) {
          out = _realTop * 6
        } else {
          out = 180
        }
        return out
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .zpm-scroll-container {
    position: relative;
    overflow: hidden;
  }
  .zpm-scroll-wrapper {
    /*position: absolute;*/
    top: 0;
    left: 0;
    width: 100%;
    float: left;
  }
  .pull-refresh {
    /*position: absolute;*/
    /*top: -30px;*/
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    color: #999;
    margin: 0;
    padding: 0;
    text-align: center;
  }
  .pull-refresh .pull-down-icon {
    display: inline-block;
    width: 25px;
    height: 25px;
    vertical-align: middle;
    margin: 0 auto;
    background: url("./pull-icon@2x.png") 0 0 no-repeat;
    -webkit-background-size: 25px 50px;
    -moz-background-size: 25px 50px;
    -o-background-size: 25px 50px;
    background-size: 25px 50px;
  }
  .pull-refresh .pull-up-icon {
    display: inline-block;
    width: 25px;
    height: 25px;
    vertical-align: middle;
    margin: 0 auto;
    background: url("./pull-icon@2x.png") 0 0 no-repeat;
    -webkit-background-size: 25px 50px;
    -moz-background-size: 25px 50px;
    -o-background-size: 25px 50px;
    background-size: 25px 50px;
    -webkit-transform: rotate(180deg);
    -moz-transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    -o-transform: rotate(180deg);
    transform: rotate(180deg);
  }
  .pull-refresh .pull-tip {
    display: inline-block;
    margin: 0;
    padding: 0;
    vertical-align: middle;
  }
  @-webkit-keyframes loading {
    from { -webkit-transform:rotate(0deg) translateZ(0); }
    to { -webkit-transform:rotate(360deg) translateZ(0); }
  }
  @-moz-keyframes loading {
    from { -webkit-transform:rotate(0deg) translateZ(0); }
    to { -webkit-transform:rotate(360deg) translateZ(0); }
  }
  .pull-down-icon.loading {
    background: url("./loading.gif") 50% 50% no-repeat;
    /*background-position:0 100%;*/
    /*-webkit-transform:rotate(0deg) translateZ(0);*/
    /*-webkit-transition-duration:0ms;*/

    /*-webkit-animation-name:loading;*/
    /*-webkit-animation-duration:2s;*/
    /*-webkit-animation-iteration-count:infinite;*/
    /*-webkit-animation-timing-function:linear;*/
  }
</style>
