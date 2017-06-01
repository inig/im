import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/default/Home'
import MobileHome from '../views/mobile/Home.vue'
import MobileSession from '../views/mobile/session/Session.vue'
import MobileChat from '../views/mobile/chat/Chat.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/m',
      component: MobileHome,
      children: [
        {
          path: 'session',
          component: MobileSession
        },
        {
          path: 'chat',
          component: MobileChat
        }
      ]
    }
  ]
})
