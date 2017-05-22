import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import * as actions from './actions'
import * as getters from './getters'
import * as mutations from './mutations'
import counter from './modules/count'
import messages from './modules/message'
import socketio from './modules/socketio'
import { getPlatformType } from '../util/platform'

Vue.use(Vuex)

const state = {
  appkey: '',
  loading: true,
  account: '',
  window: false,
  token: '',
  currentaccount: '',
  currentsession: '',
  personinfo: {},
  friends: [],
  msgs: {},
  job: {},
  history: false,
  historyData: [],
  sessions: [],
  realsessions: [],
  blacklist: [],
  sysMsgs: [],
  inWindow: false,
  grouplist: [], // 分组特有特有
  resume: {}, // 招聘简历特有,
  isMobile: false,  // 是否为手机,
  newHistoryData: [], // 新的请求
  jobInfo: {}, // 用jobnumber作key
  step: 0,    // 0表示处于会话列表，1表示处于聊天界面，...
  showMoreItems: false,
  sessionMembers: {},   // 会话成员
  locations: [],  // 浏览器历史记录
  unreadCount: {}, // 所有会话的未读消息数量
  requestUrl: 'http://mtest2.zhaopin.com/', // c端接口地址
  version: '1.0.0',
  historyQueue: {}, // {unique: conversationid},
  sendingQueue: {}, // 消息发送队列 {unqiue: { times: 1, message: message }}
  maxResendTimes: 3,  // 消息自动重发次数
  sendingTimeout: 5 * 60 * 1000, // 消息发送超时时间(ms)
  maxInput: 200, // 消息最大长度
  platform: getPlatformType()    // 设备平台
}

export default new Vuex.Store({
  state,
  actions,
  mutations: mutations.mutations,
  getters,
  modules: {
    counter,
    messages,
    socketio
  }
})

if (state.platform === 1 || state.platform === 2) {
  // 移动端
  router.replace('/m')
}

window.STORE = this

window.STATE = state
