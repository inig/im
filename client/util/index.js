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
 * Created by liangshan on 2017/5/16.
 */

/***
 * 发送桌面通知,不支持IE
 * @param args
 *          - title: 桌面通知的标题(可选)
 *          - body: 桌面通知的内容
 *          - icon: 桌面通知的图标(可选)
 */
import store from '../store'
import { xhr } from './xhr'
import md5 from 'blueimp-md5'
import * as types from '../store/mutation-types'

const _encode = function (_map, _content) {
  _content = '' + _content
  if (!_map || !_content) {
    return _content || ''
  }
  return _content.replace(_map.r, function ($1) {
    let _result = _map[!_map.i ? $1.toLowerCase() : $1]
    return _result !== null ? _result : $1
  })
}

export const jsonp = xhr

export function showLoading () {
  store.commit(types.SHOW_LOADING)
}

export function hideLoading () {
  store.commit(types.HIDE_LOADING)
}

export function getUUID (txt) {
  /***
   * 生成UUID
   * @param {txt}
   * @return String
   */
  const canvas = document.createElement('canvas')
  let ctx = canvas.getContext('2d')
  ctx.textBaseline = 'top'
  ctx.font = '14px "Arial"'
  ctx.textBaseline = 'tencent'
  ctx.fillStyle = '#f60'
  ctx.fillRect(125, 1, 62, 20)
  ctx.fillStyle = '#069'
  ctx.fillText(txt, 2, 15)
  ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'
  ctx.fillText(txt, 4, 17)

  const b64 = canvas.toDataURL().replace('data:image/png;base64,', '')
  let bin = atob(b64)
  let crc = bin2hex(bin.slice(-16, -12))
  return crc
}

export function getUnique () {
  return md5(store.state.account + '' + store.state.token + (+new Date()))
}

export function sendNotification (args) {
  if (window.Notification) {
    const popNotice = function () {
      if (Notification.permission === 'granted') {
        const notification = new Notification(args.title || '提示', {
          body: args.body || '',
          icon: args.icon || 'http://img09.zhaopin.cn/2012/other/mobile/favicons/favicon-32x32.png'
        })

        notification.onclick = function () {
          window.focus()
          notification.close()
        }
      }
    }

    if (Notification.permission === 'granted') {
      popNotice()
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function () {
        popNotice()
      })
    }
  }
}

export const assign = (function () {
  if (typeof Object.assign !== 'function') {
    Object.assign = function (target) {
      if (target === null) {
        throw new TypeError('Cannot convert undefined or null to object')
      }
      target = Object(target)
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index]
        if (source !== null) {
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key]
            }
          }
        }
      }
      return target
    }
  }
})()

export const localstorage = (function () {
  /***
   * 原生localStorage只支持IE8+
   * 在不支持localStorage的浏览器中模拟一个localStorage, 简单实现了原生localStorage中的几个方法. 支持ff2+, IE5+, chrome3+, 其他不详
   * @param args
   */
  if (!('localStorage' in window)) {
    window.localStorage = (function () {
      let documentElement
      const isIE = !!document.all
      if (isIE) {
        documentElement = document.documentElement
        documentElement.addBehavior('#default#userdata')
      }
      return {
        setItem: function (key, value) {
          if (isIE) {
            documentElement.setAttribute('value', value)
            documentElement.save(key)
          } else {
            window.globalStorage[location.hostname][key] = value
          }
        },
        getItem: function (key) {
          if (isIE) {
            documentElement.load(key)
            return documentElement.getAttribute('value')
          }
          return window.globalStorage[location.hostname][key]
        },
        removeItem: function (key) {
          if (isIE) {
            documentElement.removeAttribute('value')
            documentElement.save(key)
          } else {
            window.globalStorage[location.hostname].removeItem(key)
          }
        }
      }
    })()
  }
})()

/**
 * 日期格式化
 * @return string
 */
export const dateFormat = (function () {
  let _map = { i: !0, r: /\byyyy|yy|MM|cM|eM|M|dd|d|HH|H|mm|ms|ss|m|s|w|ct|et\b/g }
  let _12cc = ['上午', '下午']
  let _12ec = ['A.M.', 'P.M.']
  let _week = ['日', '一', '二', '三', '四', '五', '六']
  let _cmon = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
  let _emon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
  let _fmtnmb = function (_number) {
    _number = parseInt(_number) || 0
    return (_number < 10 ? '0' : '') + _number
  }
  let _fmtclc = function (_hour) {
    return _hour < 12 ? 0 : 1
  }
  return function (_time, _format, _12time) {
    if (!_time || !_format) {
      return ''
    }
    _time = new Date(_time)
    _map.yyyy = _time.getFullYear()
    _map.yy = ('' + _map.yyyy).substr(2)
    _map.M = _time.getMonth() + 1
    _map.MM = _fmtnmb(_map.M)
    _map.eM = _emon[_map.M - 1]
    _map.cM = _cmon[_map.M - 1]
    _map.d = _time.getDate()
    _map.dd = _fmtnmb(_map.d)
    _map.H = _time.getHours()
    _map.HH = _fmtnmb(_map.H)
    _map.m = _time.getMinutes()
    _map.mm = _fmtnmb(_map.m)
    _map.s = _time.getSeconds()
    _map.ss = _fmtnmb(_map.s)
    _map.ms = _time.getMilliseconds()
    _map.w = _week[_time.getDay()]
    let _cc = _fmtclc(_map.H)
    _map.ct = _12cc[_cc]
    _map.et = _12ec[_cc]
    if (_12time) {
      _map.H = _map.H % 12
    }
    return _encode(_map, _format)
  }
})()

/**
 * 时间戳转化为日期（用于消息列表）
 * @return {string} 转化后的日期
 */
export const chatTime = (function () {
  return function (time, format) {
    return dateFormat(time, format || 'MM-dd HH:mm')
  }
})()
/**
 * 时间戳转化为日期(用于左边会话面板)
 * @return {string} 转化后的日期
 */
export const sessionTime = (function () {
  var getDayPoint = function (time) {
    time.setMinutes(0)
    time.setSeconds(0)
    time.setMilliseconds(0)
    time.setHours(0)
    var today = time.getTime()
    time.setMonth(1)
    time.setDate(1)
    var yearDay = time.getTime()
    return [today, yearDay]
  }
  return function (time) {
    var check = getDayPoint(new Date())
    if (time >= check[0]) {
      return dateFormat(time, 'HH:mm')
    } else {
      return dateFormat(time, 'MM-dd')
    }
  }
})()

export function containsNode (parent, child) {
  if (parent === child) {
    return true
  }
  while (child.parentNode) {
    if (child.parentNode === parent) {
      return true
    }
    child = child.parentNode
  }
  return false
}
