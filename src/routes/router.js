import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Dashbord from '../components/Dashboard.vue'
import Registr from '../components/Registr.vue'
import Chat from '../components/Chat.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'registr',
      component: Registr
    },
    {
      path: '/dashbord',
      name: 'dashboard',
      component: Dashbord,
      props: {}
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat,
      props: {}
    },
  ]
})