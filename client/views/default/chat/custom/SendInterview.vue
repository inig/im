<template>
  <div class="send-interview-prompt">
    <div class="send-interview-box">
      <div class="box-hd line">
        <span class="hd-title">发送面试邀请函</span>
        <i class="hd-close" @click="hideSendInterview">×</i>
      </div>
      <div class="box-bd">
        <div class="bd-intro">
          <span>1851005</span> 您好：<br>
          <span>经过我司HR的初步筛选，认为你与我们的职位要求很匹配，现诚挚邀请你来我司面谈。请准时出席，如时间上有变化也请尽快与我们联系。</span>
        </div>
        <div class="bd-line">
          <div class="form-intro">
            <span class="intro-important">*</span>面试时间
          </div>
          <div class="form-cont">
            <date-picker :date.sync="formInfo" :option="option" :limit="limit"></date-picker>
          </div>
          <div class="line-hint" v-text="errorMessages.time"></div>
        </div>
        <div class="bd-line">
          <div class="form-intro">
            <span class="intro-important">*</span>面试地点
          </div>
          <div class="form-cont">
            <input type="text" placeholder="请输入面试地点" v-model="formInfo.address" @input="checkAddr">
          </div>
          <div class="line-hint" v-text="errorMessages.address"></div>
        </div>
        <div class="bd-line">
          <div class="form-intro">
            <span class="intro-important">*</span>联系人
          </div>
          <div class="form-cont">
            <input type="text" placeholder="请输入联系人姓名" v-model="formInfo.name" @input="checkName">
          </div>
          <div class="line-hint" v-text="errorMessages.name"></div>
        </div>
        <div class="bd-line">
          <div class="form-intro">
            <span class="intro-important">*</span>联系电话
          </div>
          <div class="form-cont">
            <div class="form-select select-phone">
              <i class="list-icon im-icon icon-down"></i>
              <div class="select-text" @click="togglePhoneType" v-text="allPhoneTypes[phoneType]"></div>
              <transition name="phone-type-transition" enter-active-class="animated-p3 fadeIn" leave-active-class="animated-p3 fadeOut">
                <ul class="select-list list-phone" v-if="showPhoneType">
                  <li class="list-item" data-phone-type="0" @click="changePhoneType($event)">手机</li>
                  <li class="list-item" data-phone-type="1" @click="changePhoneType($event)">座机</li>
                </ul>
              </transition>
            </div>
            <input type="text" class="phone-number" placeholder="手机号" v-if="phoneType==0" v-model="formInfo.phone" @input="checkPhone">
            <span v-else>
              <input type="text" class="areaCode-number" placeholder="区号" v-model="formInfo.areaCode" @input="checkPhone">
              <span class="telephone-split">-</span>
              <input type="text" class="telephone-number" placeholder="固定电话" v-model="formInfo.fixedPhone" @input="checkPhone">
              <span class="telephone-split">-</span>
              <input type="text" class="extnumber-number" placeholder="分机号" v-model="formInfo.extNumber" @input="checkPhone">
            </span>
          </div>
          <div class="line-hint" v-if="phoneType==0" v-text="errorMessages.phone"></div>
          <div class="line-hint" v-if="phoneType==1" v-text="errorMessages.fixedPhone || errorMessages.areaCode || errorMessages.extNumber"></div>
        </div>
        <div class="bd-line">
          <div class="form-intro">
            <span class="intro-important">*</span>备注
          </div>
          <div class="form-cont">
            <div class="cont-line">
              <label class="option-item" v-for="(item, index) in optionArr" :key="item">
                <input type="checkbox" class="form-checkbox" :value="item.desc" v-model="formInfo.marks"> <span v-text="item.desc"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="box-ft">
        <div class="prompt-btn btn-cancel" @click="hideSendInterview">取消</div>
        <div class="prompt-btn btn-sure" @click="checkForm">确认</div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as types from '../../../../store/mutation-types'
  import DatePicker from '../../../../components/vue-datepicker.vue'
export default {
  name: 'SendInterview',
  data () {
    return {
      showPhoneType: false,
      message: this.$parent.message,
      phoneType: 0,   // 0：手机号，1: 座机
      allPhoneTypes: ['手机', '座机'],
      errorMessages: {  // 错误信息
        time: '',
        address: '',
        name: '',
        phone: '',
        areaCode: '',
        fixedPhone: '',
        extNumber: ''
      },
      formInfo: {
        time: '',
        address: '',
        name: '',
        phone: '',
        areaCode: '',   // 区号
        fixedPhone: '', // 固定电话
        extNumber: '',  // 分机号
        marks: []       // 其它备注
      },
      optionArr: [
        {
          value: false,
          id: 1,
          desc: '请携带简历'
        },
        {
          value: false,
          id: 2,
          desc: '请带纸笔'
        },
        {
          value: false,
          id: 3,
          desc: '请携带作品'
        },
        {
          value: false,
          id: 4,
          desc: '请着正装'
        }
      ],
      option: {
        type: 'min',
        week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        format: 'YYYY-MM-DD HH:mm',
        placeholder: '请选择时间',
        buttons: {
          ok: '确认',
          cancel: '取消'
        },
        inputStyle: {
          position: 'relative',
          width: '364px',
          paddingLeft: '10px',
          float: 'left',
          height: '34px',
          border: '1px solid #d3d8df',
          borderRadius: '3px',
          cursor: 'pointer',
          fontSize: '14px',
          color: '#999'
        }
      },
      limit: [
        {
          type: 'fromto',
          from: new Date(),
          to: ''
        }
      ]
    }
  },
  components: {
    'date-picker': DatePicker
  },
  methods: {
    bodyClickHandler (evt) {
      if (!evt.target.classList.contains('select-text')) {
        this.hidePhoneTypeContainer()
      }
    },
    showPhoneTypeContainer () {
      this.showPhoneType = true
      document.body.addEventListener('click', this.bodyClickHandler, false)
    },
    hidePhoneTypeContainer () {
      this.showPhoneType = false
      document.body.removeEventListener('click', this.bodyClickHandler)
    },
    togglePhoneType () {
      if (this.showPhoneType) {
        this.hidePhoneTypeContainer()
      } else {
        this.showPhoneTypeContainer()
      }
    },
    changePhoneType (target) {
      this.phoneType = Number(target.target.dataset.phoneType)
    },
    hideSendInterview () {
      this.$store.vms.chat.sendInterviewShown = false
    },
    // 计算有多少个字符
    computeStringLength (val) {
      var str = new String(val)
      var bytesCount = 0
      for (var i = 0, n = str.length; i < n; i++) {
        var c = str.charCodeAt(i)
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
          bytesCount += 1
        } else {
          bytesCount += 2
        }
      }
      return bytesCount
    },
    checkDate () {
      if (this.formInfo.time.trim() === '') {
        this.errorMessages.time = '不允许为空'
        return '不允许为空'
      } else {
        this.errorMessages.time = ''
        return ''
      }
    },
    checkAddr () {
      if (this.computeStringLength(this.formInfo.address) > 240) {
        this.errorMessages.address = '文字过长'
        return '文字过长'
      } else if (this.formInfo.address.trim() === '') {
        this.errorMessages.address = '不允许为空'
        return '不允许为空'
      } else {
        this.errorMessages.address = ''
        return ''
      }
    },
    checkName () {
      if (this.computeStringLength(this.formInfo.name) > 25) {
        this.errorMessages.name = '文字过长'
        return '文字过长'
      } else if (this.formInfo.name.trim() === '') {
        this.errorMessages.name = '不允许为空'
        return '不允许为空'
      } else {
        this.errorMessages.name = ''
        return ''
      }
    },
    checkPhone () {
      if (Number(this.phoneType) === 0) {
        if (!(/^1[34578]\d{9}$/.test(this.formInfo.phone))) {
          this.errorMessages.phone = '格式不正确'
          return '格式不正确'
        } else if (this.formInfo.phone.trim() === '') {
          this.errorMessages.phone = '不允许为空'
          return '不允许为空'
        } else {
          this.errorMessages.phone = ''
          return ''
        }
      } else if (Number(this.phoneType) === 1) {
        if (this.formInfo.fixedPhone.trim() === '') {
          this.errorMessages.fixedPhone = '不允许为空'
          return '不允许为空'
        } else if (!(/^\d{0,4}$/.test(this.formInfo.areaCode))) {
          this.errorMessages.areaCode = '格式不正确'
          return '格式不正确'
        } else if (!(/^\d{1,11}$/.test(this.formInfo.fixedPhone))) {
          this.errorMessages.fixedPhone = '格式不正确'
          return '格式不正确'
        } else if (!(/^\d{0,10}$/.test(this.formInfo.extNumber))) {
          this.errorMessages.extNumber = '格式不正确'
          return '格式不正确'
        } else {
          this.errorMessages.fixedPhone = ''
          this.errorMessages.areaCode = ''
          this.errorMessages.extNumber = ''
          return ''
        }
      }
    },
    checkForm () {
      if (this.checkDate() === '' && this.checkAddr() === '' && this.checkName() === '' && this.checkPhone() === '') {
        this.$store.commit(types.SEND_MESSAGE, {
          msgType: 2,
          customType: 1,
          date: +new Date(this.formInfo.time.trim()),
          address: this.formInfo.address.trim(),
          contact: this.formInfo.name.trim(),
          tel: (Number(this.phoneType) === 0 ? this.formInfo.phone.trim() : (this.formInfo.areaCode + '-' + this.formInfo.fixedPhone + '-' + this.formInfo.extNumber)),
          desc: this.formInfo.marks.join('; ')
        })
        this.hideSendInterview()
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .send-interview-prompt {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 99999;
    background-color: rgba(0, 0, 0, .5);
    display: flex;
    align-items: center;
    justify-content: center;
    .send-interview-box {
      position: relative;
      width: 620px;
      height: 560px;
      background-color: #fff;
      border-radius: 4px;
      .box-hd {
        width: 100%;
        height: 55px;
        line-height: 55px;
        font-size: 16px;
        color: #333;
        &.line {
          border-bottom: 1px solid #eaeff1;
        }
        .hd-title {
          margin-left: 40px;
        }
        .hd-close {
          width: 30px;
          float: right;
          margin-right: 12px;
          font-style: normal;
          font-size: 24px;
          text-align: right;
          color: #999;
          cursor: pointer;
        }
      }
      .box-bd {
        .bd-intro {
          padding-bottom: 15px;
          margin: 15px 40px;
          height: auto;
          line-height: 24px;
          font-size: 14px;
          color: #666;
          border-bottom: 1px solid #eaeff1;
        }
        .bd-line {
          clear: both;
          padding: 5px 40px;
          height: 36px;
          font-size: 14px;
          color: #999;
          z-index: 9;
          display: flex;
          align-items: center;
          /*justify-content: space-between;*/
          .form-intro {
            float: left;
            margin-right: 8px;
            width: 65px;
            height: 36px;
            line-height: 36px;
            text-align: right;
            color: #333;
            font-size: 12px;
            .intro-important {
              color: red;
            }
          }
          .form-cont {
            width: 376px;
            float: left;
            /*z-index: 9;*/
            .cov-vue-date {
              width: 100%;
            }
            input {
              width: 364px;
              position: relative;
              float: left;
              display: block;
              padding: 0 0 0 10px;
              margin: 0;
              height: 34px;
              line-height: 34px;
              border: 1px solid #d3d8df;
              border-radius: 3px;
              font-size: 14px;
              color: #999;
            }
            .form-select {
              position: relative;
              float: left;
              height: 34px;
              border: 1px solid #d3d8df;
              border-radius: 3px;
              cursor: pointer;
              &.select-phone {
                width: 68px;
                font-size: 12px;
              }
              .list-icon {
                position: absolute;
                display: block;
                top: 5px;
                right: 4px;
                pointer-events: none;
              }
              .select-list {
                overflow: hidden;
                position: absolute;
                top: 36px;
                margin: 0;
                padding: 0;
                display: block;
                list-style-type: none;
                background-color: #ffffff;
                border: 1px solid #d3d8df;
                border-radius: 3px;
                z-index: 9;
                width: 68px;
                .list-item {
                  margin: 0;
                  padding: 0 0 0 10px;
                  height: 34px;
                  line-height: 34px;
                  &:hover {
                    background: #ccc;
                  }
                }
              }
            }
            .phone-number {
              width: 286px;
              position: relative;
              float: left;
              display: block;
              padding: 0 0 0 10px;
              margin: 0 0 0 8px;
              height: 34px;
              line-height: 34px;
              border: 1px solid #d3d8df;
              border-radius: 3px;
              font-size: 14px;
              color: #999;
            }
            .cont-line {
              height: 36px;
              line-height: 36px;
              &.mark-line {
                width: 475px;
                .line-hint {
                  float: right;
                }
              }
              .option-item {
                float: left;
                margin: 0 8px 0 0;
                padding: 0;
                /*margin-right: 4px;*/
                font-size: 14px;
                color: #333;
              }
              .option-item.item-line {
                margin-right: 0;
              }
              .form-checkbox {
                margin: 10px 6px 0 0;
                padding: 0;
                float: left;
                display: block;
                width: 16px;
                height: 16px;
              }
            }
            .areaCode-number {
              width: 55px!important;
              margin-left: 7px!important;
            }
            .telephone-number {
              width: 105px!important;
            }
            .extnumber-number {
              width: 80px!important;
            }
            .telephone-split {
              float: left;
              line-height: 34px;
              padding: 0 2px;
            }
            .areaCode-number, .telephone-number, .extnumber-number {
              width: 364px;
              position: relative;
              float: left;
              display: block;
              padding: 0 0 0 10px;
              margin: 0;
              height: 34px;
              line-height: 34px;
              border: 1px solid #d3d8df;
              border-radius: 3px;
              font-size: 14px;
              color: #999;
            }
          }
          .line-hint {
            float: left;
            width: 85px;
            line-height: 36px;
            padding-left: 5px;
            color: #fa6460;
            font-size: 14px;
          }

          .select-text {
            padding-left: 8px;
            height: 34px;
            line-height: 34px;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
        }
      }
      .box-ft {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 65px;
        display: flex;
        align-items: center;
        justify-content: center;
        .prompt-btn {
          position: relative;
          float: left;
          width: 110px;
          height: 40px;
          line-height: 40px;
          font-size: 16px;
          text-align: center;
          border: 1px solid #29a9db;
          border-radius: 3px;
          cursor: pointer;
          &.btn-cancel {
            margin-right: 20px;
            color: #29a9db;
            &:hover {
              color: #00a0db;
            }
          }
          &.btn-sure {
            color: #fff;
            background-color: #29a9db;
            &:hover{
              background: #00a0db;
            }
          }
        }
      }
    }
  }
</style>
