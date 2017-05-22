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
 * Created by liangshan on 2017/5/17.
 */
import store from './'
import * as types from './mutation-types'

function isIn (arr, arrKey, targetValue) {
  let index = -1
  for (let i = 0; i < arr.length; i++) {
    if (String(arr[i][arrKey]) === String(targetValue)) {
      index = i
      i = arr.length
    }
  }
  return index
}

export const mutations = {
  [types.UPDATE_SESSION] (state) {
    store.vms.sessionList.$forceUpdate()
    for (let i = 0; i < store.vms.sessionList.$children.length; i++) {
      store.vms.sessionList.$children[i].$forceUpdate()
    }
  },
  [types.UPDATE_CHAT] () {
    store.vms.chat && store.vms.chat.$forceUpdate()
  },
  [types.UPDATE_CHAT_VIEW] () {
    store.vms.chatView && store.vms.chatView.$forceUpdate()
  },
  [types.INIT_SESSIONS] (state, sessions) {
    state.sessions = sessions
    for (let i = 0; i < sessions.length; i++) {
      store.dispatch('socket_getGroupInfo', {
        discussionId: sessions[i].conversationid
      })
    }
  },
  [types.SHOW_LOADING] (state) {
    state.loading = true
  },
  [types.HIDE_LOADING] (state) {
    state.loading = false
  },
  [types.INIT_PERSON_INFO] (state, data) {
    for (let i = 0; i < data.length; i++) {
      const info = {}
      // TODO personinfo暂时用conversationid作key
      info[data[i].userid] = data[i]
      state.personinfo = Object.assign({}, state.personinfo, info)
    }
  },
  [types.SET_CURRENT_SESSION] (state, data) {
    state.currentsession = data.id
    state.currentaccount = data.to
  },
  [types.RESET_CURRENT_SESSION] (state) {
    state.currentsession = ''
    state.currentaccount = ''
  },
  [types.INIT_SESSION_MEMBERS] (state, data) {
    console.log('............... data', data)
    if (isIn(state.sessions, 'conversationid', data.id) === -1) {
      data.conversationid = data.id
      state.sessions.splice(0, 0, data)
    }
    if (!state.sessionMembers.hasOwnProperty(data.id)) {
      let _userInfo = []
      let tempMember
      for (let i = 0; i < data.discussionMemberList.length; i++) {
        tempMember = data.discussionMemberList[i]
        if (String(tempMember.userId) !== String(state.account)) {
          _userInfo.push(tempMember)
        }
      }
      state.sessionMembers[data.id] = _userInfo
      store.vms.sessionList.$forceUpdate()
    }
  },
  [types.ADD_SESSION] (state, data) {
    store.dispatch('socket_getGroupInfo', {
      discussionId: data.discussionId
    })
  },
  [types.REMOVE_SESSION] (state, data) {
    /***
     * 删除会话
     */
    if (String(state.currentsession) === String(data.id)) {
      state.currentaccount = ''
      state.currentsession = ''
    }
    let _index = isIn(state.sessions, 'conversationid', data.id)
    if (_index !== -1) {
      state.sessions.splice(_index, 1)
      store.vms.sessionList.$forceUpdate()
    }
  },
  [types.SET_CURRENT_SESSION_INFO] (state, data) {
    /***
     * 设置当前会话信息
     */
    state.jobInfo = data
  },
  [types.RECEIVED_NEW_MESSAGE] (state, data) {
    /***
     * 接收到新消息
     */
    let _index = isIn(state.sessions, 'conversationid', data.to)
    if (_index !== -1) {
      state.sessions[_index].sendtime = data.sendTime
      Object.assign(state.sessions[_index], data)
      if (String(data.to) === String(state.currentsession)) {
        store.dispatch('socket_clearConversationUnreadCount', {
          'conversationType': 1,
          'targetId': data.to
        })
      } else {
        if (state.unreadCount.hasOwnProperty(data.to)) {
          state.unreadCount[data.to] += 1
        } else {
          state.unreadCount[data.to] = 1
        }
      }
      store.vms.sessionList.$forceUpdate()
    }
    if (state.msgs.hasOwnProperty(data.to)) {
      state.msgs[data.to].push(data)
    } else {
      state.msgs[data.to] = [data]
    }
    if (store.hasOwnProperty('vms') && store.vms.hasOwnProperty('chatView')) {
      store.vms.chatView.$forceUpdate()
    }
  },
  [types.INIT_ALL_UNREAD_COUNT] (state, data) {
    /***
     * 初始化所有会话未读消息数量
     */
    let map = {}
    for (let i = 0; i < data.unreadCount.length; i++) {
      map[data.unreadCount[i].conversationId] = data.unreadCount[i].count
    }
    state.unreadCount = map
  },
  [types.CLEAR_UNREAD_COUNT] (state) {
    /***
     * 清空某个会话的未读数量
     */
    console.log('....CLEAR_UNREAD_COUNT....', state.unreadCount.hasOwnProperty(state.currentsession), state.currentsession, store)
    if (state.unreadCount.hasOwnProperty(state.currentsession)) {
      state.unreadCount[state.currentsession] = 0
      store.commit(types.UPDATE_SESSION)
    }
  },
  [types.INIT_LOCAL_MESSAGES] (state, data) {
    /***
     * 缓存会话消息
     */
    console.log('缓存会话消息: ', data, '......', state)
    if (!state.msgs.hasOwnProperty(data.conversationid)) {
      state.msgs[data.conversationid] = data.list
      // store.vms.chat.$forceUpdate()
    }
  },
  [types.DO_SCROLL] () {
    store.vms.chatView.$refs.chatView.scrollTop = 9999999
  },
  [types.SEND_MESSAGE] (state, data) {
    console.log('发送消息——————————————', store.vms.chatEdit, '-=======', data)
    store.vms.chatEdit.send(null, data)
  },
  [types.SEND_MESSAGE_SUCCESS] (state, data) {
    let _msg = ''
    let _messages = state.msgs[data.conversationId]
    let _tempMessage
    for (let i = _messages.length - 1; i >= 0; i--) {
      _tempMessage = _messages[i]
      if (_tempMessage.hasOwnProperty('unique') && String(_tempMessage.unique) === String(data.unique)) {
        _msg = _tempMessage.message
        _tempMessage.messageId = data.messageId
        _tempMessage.createTime = data.createTime
        i = -1
      }
    }
    // 修改sessionList，最后一条消息
    let _index = isIn(state.sessions, 'conversationid', data.conversationId)
    console.log('修改最后一条消息', _index, _msg)
    if (_index !== -1) {
      state.sessions[_index].sendtime = data.createTime
      state.sessions[_index].message = _msg
      Object.assign(state.sessions[_index], data)
      store.vms.sessionList.$forceUpdate()
    }
  },
  [types.UPDATE_MESSAGE] (state, data) {
    let _messages = state.msgs[data.conversationId]
    let _tempMessage
    for (let i = _messages.length - 1; i >= 0; i--) {
      _tempMessage = _messages[i]
      if (String(_tempMessage.messageId) === String(data.messageId)) {
        if (_tempMessage.readers.indexOf(Number(data.userId)) < 0 || _tempMessage.readers.indexOf(String(data.userId)) < 0) {
          _tempMessage.readers.push(Number(data.userId))
          store.vms.chatView.$forceUpdate()
        }
        i = -1
      }
    }
  }
}