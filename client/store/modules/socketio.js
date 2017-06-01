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
import store from '../'
import { jsonp, getUnique, showLoading, hideLoading } from 'util/index'
import * as types from '../mutation-types'
import cookie from 'js-cookie'

const io = require('../../../node_modules/socket.io/node_modules/socket.io-client/dist/socket.io')

const userAgent = navigator.userAgent.toLowerCase()
const isMac = /macintos|mac os x/i.test(userAgent)
const deviceType = isMac ? 4 : 3
// let socketServer = 'im04.zhaopin.com:1883'
let socketServer = 'http://im05.zhaopin.cn'

const getters = {}

const state = {
  socket: null
}

function socketInit (state) {
  state.socket.on('response', data => {
    hideLoading()
    console.log('ON RESPONSE: ', data)
    let responseType = data.header.group + '-' + data.header.signall
    let responseBody = JSON.parse(data.body)
    switch (responseType) {
      case '2-1':
        if (Number(responseBody.code) === 200) {
          console.log('发送消息成功：', {
            'header': data.header,
            'body': responseBody
          })
          console.log('****** send success *******', data.header.unique)
          if (store.state.sendingQueue.hasOwnProperty(data.header.unique)) {
            store.commit(types.SEND_MESSAGE_SUCCESS, {
              conversationId: store.state.currentsession,
              unique: data.header.unique,
              messageId: responseBody.message.messageId,
              createTime: responseBody.message.createTime
            })

            delete store.state.sendingQueue[data.header.unique]
          }

          store.commit(types.UPDATE_CHAT_VIEW)
          setTimeout(function () {
            store.commit(types.DO_SCROLL)
          }, 100)
        }
        break
      case '3-2':
        if (Number(responseBody.code) === 200) {
          console.log('获取会话列表成功：', {
            'header': data.header,
            'body': responseBody
          })
          if (responseBody.hasOwnProperty('list')) {
            // store.commit(types.INIT_PERSON_INFO, responseBody.list)
            store.commit(types.INIT_SESSIONS, responseBody.list)
          }
        }
        break
      case '2-2':
        if (Number(responseBody.code) === 200) {
          console.log('获取讨论组信息成功：', {
            'header': data.header,
            'body': responseBody
          }, responseBody.discussionInfo.id)
          if (responseBody.hasOwnProperty('discussionInfo')) {
            store.commit(types.INIT_SESSION_MEMBERS, responseBody.discussionInfo)
          }

          if (!store.state.msgs.hasOwnProperty(responseBody.discussionInfo.id)) {
            store.dispatch('socket_getHistoryMessage', {
              'targetId': responseBody.discussionInfo.id,
              'conversationType': 1,
              'timestap': (+new Date() - 1 * 12 * 30 * 24 * 60 * 60 * 1000),
              'count': 99999,
              'direction': 0
            })
          }
        }
        break
      case '2-3':
        if (Number(responseBody.code) === 200) {
          console.log('获取历史消息成功：', {
            'header': data.header,
            'body': responseBody
          }, store.state.historyQueue)
          if (responseBody.hasOwnProperty('list') && store.state.historyQueue.hasOwnProperty(data.header.unique)) {
            store.commit(types.INIT_LOCAL_MESSAGES, {
              conversationid: store.state.historyQueue[data.header.unique],
              list: responseBody.list
            });
            delete store.state.historyQueue[data.header.unique]
          }
        }
        break
      case '3-1':
        if (Number(responseBody.code) === 200) {
          console.log('获取消息未读全部数量：', {
            'header': data.header,
            'body': responseBody
          })
          if (responseBody.hasOwnProperty('list') && responseBody.list.length > 0) {
            store.commit(types.INIT_ALL_UNREAD_COUNT, responseBody.list[0])
          }
        }
        break
      case '3-6':
        if (Number(responseBody.code) === 200) {
          console.log('清空会话列表未读数量成功：', {
            'header': data.header,
            'body': responseBody
          })
          store.commit(types.CLEAR_UNREAD_COUNT)
        }
        break
      default:
        break
    }
  })
  state.socket.on('out', data => {
    console.log('ON OUT: ', data)
    let responseType = data.header.group + '-' + data.header.signall
    let responseBody = JSON.parse(data.body)
    switch (responseType) {
      case '2-9':
        /***
         * 被邀请 加入讨论组
         */
        console.log('被邀请加入讨论组: ' + responseBody.discussionId + '\n包括用户：' + responseBody.userIdList.join(', '))
        state.socket.emit('in', {
          'version': '1',
          'type': '4',
          'group': '2',
          'signall': '1',
          'unique': data.header.unique
        })
        store.commit(types.ADD_SESSION, responseBody)
        break
      case '2-1':
        /***
         * 接收到新消息
         */
        console.log('讨论组' + responseBody.to + '中成员' + responseBody.from + '对您说："' + responseBody.message + '"')
        state.socket.emit('in', {
          'header': {
            'version': '1',
            'type': '4',
            'group': '2',
            'signall': '1',
            'unique': data.header.unique
          }
        })
        store.commit(types.RECEIVED_NEW_MESSAGE, responseBody)
        if (String(responseBody.to) === String(store.state.currentsession)) {
          setTimeout(function () {
            if (store.state.chatScroll.y <= store.state.chatScroll.maxScrollY + 20) {
              store.commit(types.SET_CHAT_SCROLL)
              store.commit(types.DO_SCROLL)
            } else {
              store.commit(types.SET_NEW_MESSAGE_COUNT, {
                count: store.state.newMessageCount + 1
              })
              store.commit(types.SET_CHAT_SCROLL)
            }
          }, 10)
        }
        break
      case '2-4':
        /***
         * 讨论组其它成员将消息设为已读
         */
        console.log('讨论组（' + responseBody.conversationId + '）中的用户（' + responseBody.userId + '）读取了消息（' + responseBody.messageId + '）')
        state.socket.emit('in', {
          'header': {
            'version': '1',
            'type': '4',
            'group': '2',
            'signall': '1',
            'unique': data.header.unique
          }
        })
        store.commit(types.UPDATE_MESSAGE, {
          userId: responseBody.userId,
          conversationId: responseBody.conversationId,
          messageId: responseBody.messageId
        })
        break
      case '2-12':
        /***
         * 讨论组其它成员解散讨论组
         */
        console.log('讨论组' + responseBody.discussionId + '已经被解散，您已经退出讨论组!')
        state.socket.emit('in', {
          'header': {
            'version': '1',
            'type': '4',
            'group': '2',
            'signall': '12',
            'unique': data.header.unique
          }
        })
        store.commit(types.REMOVE_SESSION, {
          id: responseBody.discussionId
        })
        break
      default:
        break
    }
  })
}

const actions = {
  socket_connect: (context) => {
    // jsonp({
    //   url: 'Im/GetToken?uticket=' + cookie.get('rt'),
    //   success: function (res) {
    //     console.log('@@@@@@@@@@@@@@', res)
    //     store.state.account = res.data.accid
    //     store.state.token = cookie.get('at')
    //
    //     let socket = io.connect(socketServer + '?device_id=' + store.state.account + '&token=' + store.state.token + '&device_type=' + deviceType)
    //     context.commit(types.SOCKET_CONNECT, {
    //       socket: socket
    //     })
    //   }
    // })

    // store.state.account = '660527147'
    // store.state.token = '45855943db284dceb5aa38e31d35f8ba'
    // let socket = io.connect(socketServer + '?device_id=' + store.state.account + '&token=' + store.state.token + '&device_type=' + deviceType)
    // context.commit(types.SOCKET_CONNECT, {
    //   socket: socket
    // })

    store.state.account = '689607786'
    store.state.token = '416a5a9b2b6942fca159700289dc5fb1'
    let socket = io.connect(socketServer + '?device_id=' + store.state.account + '&token=' + store.state.token + '&device_type=' + deviceType)
    context.commit(types.SOCKET_CONNECT, {
      socket: socket
    })

    // let socket = new WebSocket('ws://192.168.212.216:8888/socket.io')
    // context.commit(types.SOCKET_CONNECT, {
    //   socket: socket
    // })
  },
  socket_publish: (context, message) => {
    console.log('socket publish: ', context)
    context.emit('publish', {
      'header': {
        'version': 1,
        'type': 1,
        'group': 3,
        'signall': 2,
        'unique': getUnique()
      },
      'body': JSON.stringify({
        'conversationType': message.conversationType || '1'
      })
    })
  },
  socket_getConversationList: (context, message) => {
    /***
     * 获取会话列表
     */
    context.state.socket.emit('publish', {
      'header': {
        'version': 1,
        'type': 1,
        'group': 3,
        'signall': 2,
        'unique': getUnique()
      },
      'body': JSON.stringify({
        'conversationType': message.conversationType || '1'
      })
    })
  },
  socket_getGroupInfo: (context, data) => {
    /***
     * 获取讨论组信息
     */
    context.state.socket.emit('publish', {
      'header': {
        'version': 1,
        'type': 1,
        'group': 2,
        'signall': 2,
        'unique': getUnique()
      },
      'body': JSON.stringify({
        'discussionId': data.discussionId
      })
    })
  },
  socket_initAllUnreadCount: (context, data) => {
    /***
     * 初始化所有会话未读消息数量
     */
    context.state.socket.emit('publish', {
      'header': {
        'version': 1,
        'type': 1,
        'group': 3,
        'signall': 1,
        'unique': getUnique()
      },
      'body': JSON.stringify({
        'conversationType': data.conversationType || '1'
      })
    })
  },
  // socket_setRead: (context, data) => {
  //   /***
  //    * 设置已读
  //    * @param opts:
  //    *          - conversationId: {String} 会话id
  //    *          - messageId: {String} 消息id
  //    *          - timestamp: {date} 时间戳，服务器端取到的时间戳
  //    *          - conversationType: 会话类型. default: '1'
  //    */
  //   context.state.socket.emit('publish', {
  //     'header': {
  //       'version': 1,
  //       'type': 1,
  //       'group': 2,
  //       'signall': 4,
  //       'unique': getUnique()
  //     },
  //     'body': JSON.stringify({
  //       'conversationType': data.conversationType || '1',
  //       'conversationId': data.conversationId,
  //       'messageId': data.messageId,
  //       'timestamp': data.timestamp
  //     })
  //   })
  // },
  socket_clearConversationUnreadCount: (context, data) => {
    /***
     * 清空会话未读数量
     * @param opts:
     *          - targetId: {String} 会话id
     *          - conversationType: {Number} 会话类型. default: 1
     */
    context.state.socket.emit('publish', {
      'header': {
        'version': 1,
        'type': 1,
        'group': 3,
        'signall': 6,
        'unique': getUnique()
      },
      'body': JSON.stringify({
        'targetId': data.targetId,
        'conversationType': data.conversationType || '1'
      })
    })
  },
  socket_getHistoryMessage: (context, data) => {
    /***
     * 获取历史消息
     * @param opts:
     *          - targetId: {String} 会话id
     *          - conversationId: {String} 会话类型. default: 1
     *          - timestap: {date} 时间戳，从这个时间点之后取消息
     *          - count: {Number} 消息条数
     *          - direction {Number} 0:取timestap之后的消息，1取timestap之前的消息
     */
    const _unique = getUnique()
    !store.state.historyQueue.hasOwnProperty(_unique) && (store.state.historyQueue[_unique] = data.targetId)
    context.state.socket.emit('publish', {
      'header': {
        'version': 1,
        'type': 1,
        'group': 2,
        'signall': 3,
        'unique': _unique
      },
      'body': JSON.stringify({
        'targetId': data.targetId,
        'conversationType': data.conversationType || '1',
        'timestap': data.timestap || (+new Date()),
        'count': data.count,
        'direction': data.direction || 0
      })
    })
  },
  socket_sendMessage: (context, data) => {
    /***
     * 发送消息
     * @param data.times 消息重发次数
     * @param data.message:
     *          - from: {String} 消息发送者id
     *          - to: {String} 讨论组id
     *          - conversationType: {String} 会话类型
     *          - msgType: {String} 消息类型，文本消息 1，自定义消息 2
     *          - message: {String} 消息具体内容
     *          - sendTime: {date} 消息发送时间，客户端生成
     */
    if (Number(data.times) <= Number(store.state.maxResendTimes)) {
      // const _unique = getUnique()
      // !store.state.sendingQueue.hasOwnProperty(_unique) && (store.state.sendingQueue[_unique] = {
      //   times: Number(data.times) + 1,
      //   message: data.message
      // })
      let _timeStamp = data.message.sendTime || (+new Date())
      context.state.socket.emit('publish', {
        'header': {
          'version': 1,
          'type': 1,
          'group': 2,
          'signall': 1,
          'unique': data.message.unique
        },
        'body': JSON.stringify({
          'from': data.message.from,
          'to': data.message.to,
          'conversationType': data.message.conversationType || '1',
          'msgType': data.message.msgType,
          'message': data.message.message,
          'sendTime': _timeStamp
        })
      })
      let resendTimeout
      if (store.state.sendingQueue.hasOwnProperty(data.message.unique)) {
        resendTimeout = setTimeout(function () {
          store.dispatch('socket_sendMessage', Object.assign(data, {times: Number(data.times) + 1}))
        }, store.state.sendingTimeout)
      } else {
        clearTimeout(resendTimeout)
      }
    }
  }
}

const mutations = {
  [types.SOCKET_CONNECT] (state, data) {
    state.socket = data.socket
    console.log('======== socket connected! =========', state)

    socketInit(state)

    store.dispatch('socket_getConversationList', {
      conversationType: 1
    })

    store.dispatch('socket_initAllUnreadCount', {
      conversationType: 1
    })
  },
  [types.SOCKET_DISCONNECT] (state) {
    console.log('======== socket disconnected! =========')
    state.connect = false
  },
  [types.SOCKET_RESPONSE] (state, data) {
    console.log('........... response: ', data)
  },
  [types.SOCKET_GET_CONVERSATION_LIST] (state, data) {
    console.log('.... SOCKET_GET_CONVERSATION_LIST', state)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
