import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import App from './components/App'
import router from './router'
import store from './store'
// import cookie from 'js-cookie'
// import { jsonp } from 'util/index'

sync(store, router)

const userAgent = navigator.userAgent.toLowerCase()
const isMac = /macintos|mac os x/i.test(userAgent)
const deviceType = isMac ? 4 : 3
let socketServer = 'http://im05.zhaopin.cn'
// let socketServer = 'http://im04.zhaopin.com:80'
// jsonp({
//   url: 'Im/GetToken?uticket=' + cookie.get('rt'),
//   success: function (res) {
//     console.log('@@@@@@@@@@@@@@', res)
//     // 获取会话列表
//     console.log('........ STORE', store)
//     store.state.account = res.data.accid
//     store.state.token = res.data.token
//   }
// })

Notification.requestPermission()

const app = new Vue({
  router,
  store,
  ...App
})

export { app, router, store }
