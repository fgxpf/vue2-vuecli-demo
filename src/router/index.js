import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'report',
    component: () => import(/* webpackChunkName: "about" */ '../views/report.vue')
  },
  {
    path: '/map',
    component: () => import(/* webpackChunkName: "about" */ '../views/map.vue')
  }
]

const router = new VueRouter({
  base: window.__POWERED_BY_QIANKUN__ ? '/subapp/vue2/' : '/',
  mode: 'history',
  routes
})

export default router
