/***
 **                                                          _ooOoo_
 **                                                         o8888888o
 **                                                         88" . "88
 **                                                         (| -_- |)
 **                                                          O\ = /O
 **                                                      ____/`---'\____
 **                                                    .   ' \\| |// `.
 **                                                     / \\||| : |||// \
 **                                                   / _||||| -:- |||||- \
 **                                                     | | \\\ - /// | |
 **                                                   | \_| ''\---/'' | |
 **                                                    \ .-\__ `-` ___/-. /
 **                                                 ___`. .' /--.--\ `. . __
 **                                              ."" '< `.___\_<|>_/___.' >'"".
 **                                             | | : `- \`.;`\ _ /`;.`/ - ` : | |
 **                                               \ \ `-. \_ __\ /__ _/ .-` / /
 **                                       ======`-.____`-.___\_____/___.-`____.-'======
 **                                                          `=---='
 **
 **                                       .............................................
 **                                              佛祖保佑             永无BUG
 **                                      佛曰:
 **                                              写字楼里写字间，写字间里程序员；
 **                                              程序人员写程序，又拿程序换酒钱。
 **                                              酒醒只在网上坐，酒醉还来网下眠；
 **                                              酒醉酒醒日复日，网上网下年复年。
 **                                              但愿老死电脑间，不愿鞠躬老板前；
 **                                              奔驰宝马贵者趣，公交自行程序员。
 **                                              别人笑我忒疯癫，我笑自己命太贱；
 **                                              不见满街漂亮妹，哪个归得程序员？
 */
/**
 * Created by liangshan on 2017/5/18.
 */
import Vue from 'vue'
import * as util from './index'

/***
 * 会话列表时间戳格式化
 * @attr {data-value} 待格式化的时间戳(13位)，[required|必填]
 */
Vue.directive('sessionTime', {
  inserted: function (el, binding, vnode) {
    let _value = vnode.elm.dataset.value || ''
    if (_value === '') {
      console.error('绑定v-session-time指令的DOM元素', el, '，缺少data-value属性')
    } else {
      el.innerHTML = util.sessionTime(Number(_value))
    }
  },
  update: function (el, binding, vnode) {
    let _value = vnode.elm.dataset.value || ''
    if (_value === '') {
      console.error('绑定v-session-time指令的DOM元素', el, '，缺少data-value属性')
    } else {
      el.innerHTML = util.sessionTime(Number(_value))
    }
  }
})

/***
 * 聊天窗口时间戳格式化
 * @attr {data-value} 待格式化的时间戳(13位)，[required|必填]
 * @attr {data-format} 格式化模板            [optional|可选]
 */
Vue.directive('chatTime', {
  inserted: function (el, binding, vnode) {
    let _value = vnode.elm.dataset.value || ''
    let _formatStr = vnode.elm.dataset.format || 'MM-dd HH:mm'
    if (_value === '') {
      console.error('绑定v-chat-time指令的DOM元素，缺少data-value属性')
    } else {
      el.innerHTML = util.chatTime(Number(_value), _formatStr)
    }
  },
  update: function (el, binding, vnode) {
    let _value = vnode.elm.dataset.value || ''
    let _formatStr = vnode.elm.dataset.format || 'MM-dd HH:mm'
    if (_value === '') {
      console.error('绑定v-chat-time指令的DOM元素，缺少data-value属性')
    } else {
      el.innerHTML = util.chatTime(Number(_value), _formatStr)
    }
  }
})

// /***
//  * 通用时间戳格式化
//  * @attr {data-value} 待格式化的时间戳(13位)，[required|必填]
//  * @attr {data-format} 格式化模板            [optional|可选]
//  */
// Vue.directive('timeFormat', {
//   inserted: function (el, binding, vnode) {
//     let _value = vnode.elm.dataset.value || ''
//     let _formatStr = vnode.elm.dataset.format || 'yyyy-MM-dd HH:mm:ss'
//     if (_value === '') {
//       console.error('绑定v-time-format指令的DOM元素，缺少data-value属性')
//     } else {
//       el.innerHTML = util.dateFormat(Number(_value), _formatStr)
//     }
//   }
// })

Vue.directive('timeFormat', {
  inserted: function (el, binding, vnode) {
    let _format = (vnode.elm.dataset.hasOwnProperty('format') ? vnode.elm.dataset.format.toLowerCase() : '')
    let _value = vnode.elm.dataset.value
    if (!isNaN(_value) && _value.length === 13) {
      const _date = new Date(Number(_value))
      const _year = _date.getFullYear()
      const _month = _date.getMonth()
      const _day = _date.getDate()
      const _hour = _date.getHours()
      const _minute = _date.getMinutes()
      const _second = _date.getSeconds()

      const _now = new Date()
      const _nowYear = _now.getFullYear()
      const _nowMonth = _now.getMonth()
      const _nowDay = _now.getDate()
      if (!_format) {
        if (_year < _nowYear) {
          _format = _year +
            '-' + (_month + 1 < 10 ? ('0' + (_month + 1)) : (_month + 1)) +
            '-' + (_day < 10 ? ('0' + _day) : _day) +
            ' ' + (_hour < 10 ? ('0' + _hour) : _hour) +
            ':' + (_minute < 10 ? ('0' + _minute) : _minute) +
            ':' + (_second < 10 ? ('0' + _second) : _second)
        } else if (_month < _nowMonth || (_month === _nowMonth && _day < _nowDay - 2)) {
          _format = (_month + 1 < 10 ? ('0' + (_month + 1)) : (_month + 1)) +
            '-' + (_day < 10 ? ('0' + _day) : _day) +
            ' ' + (_hour < 10 ? ('0' + _hour) : _hour) +
            ':' + (_minute < 10 ? ('0' + _minute) : _minute) +
            ':' + (_second < 10 ? ('0' + _second) : _second)
        } else if (_day === _nowDay - 2) {
          // 前天
          _format = '前天' +
            ' ' + (_hour < 10 ? ('0' + _hour) : _hour) +
            ':' + (_minute < 10 ? ('0' + _minute) : _minute) +
            ':' + (_second < 10 ? ('0' + _second) : _second)
        } else if (_day === _nowDay - 1) {
          // 昨天
          _format = '昨天' +
            ' ' + (_hour < 10 ? ('0' + _hour) : _hour) +
            ':' + (_minute < 10 ? ('0' + _minute) : _minute) +
            ':' + (_second < 10 ? ('0' + _second) : _second)
        } else if (_day === _nowDay) {
          // 今天
          _format = (_hour < 10 ? ('0' + _hour) : _hour) +
            ':' + (_minute < 10 ? ('0' + _minute) : _minute) +
            ':' + (_second < 10 ? ('0' + _second) : _second)
        }
      } else {
        _format = _format.replace(/yyyy/, _year + '')
          .replace(/mm/, (_month + 1) < 10 ? ('0' + (_month + 1)) : ((_month + 1) + ''))
          .replace(/dd/, (_day < 10 ? ('0' + _day) : (_day + '')))
          .replace(/h/, (_hour < 10 ? ('0' + _hour) : (_hour + '')))
          .replace(/m/, (_minute < 10 ? ('0' + _minute) : (_minute + '')))
          .replace(/s/, (_second < 10 ? ('0' + _second) : (_second + '')))
      }
      el.innerText = _format
    } else {
      el.innerText = _value
    }
  }
})
