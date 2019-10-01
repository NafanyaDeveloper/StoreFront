import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Admin from './views/Admin.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        {
          path: 'items',
          component: () => import('./components/Item.vue')
        },
        {
          path: 'orders',
          component: () => import('./components/Order.vue')
        },
        {
          path: 'cart',
          component: () => import('./components/Cart.vue')
        },
        {
          path: '',
          component: () => import('./views/Hello.vue')
        }
      ]
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      children: [
        {
          path: 'items',
          component: () => import('./components/Item.vue')
        },
        {
          path: 'orders',
          component: () => import('./components/Order.vue')
        },
        {
          path: 'users',
          component: () => import('./components/User.vue')
        },
        {
          path: 'customers',
          component: () => import('./components/Customer.vue')
        },
        {
          path: '',
          component: () => import('./views/Hello.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./components/Login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('./components/Register.vue'),
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
})
