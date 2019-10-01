import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap' 
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import dateFilter from './filters/DateFilter'
import store from '@/store'
import interceptor from '@/interceptor.js'

Vue.prototype.$http = axios

Vue.config.productionTip = false

interceptor();

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('jwt');
  const role = localStorage.getItem('role');

  if (authRequired && !loggedIn) {
    return next('/login');
  }
  if (!authRequired && loggedIn) {
    return next('/home');
  }
  if (to.path.startsWith('/admin') && role != "manager")
    return next('/home')
  if (to.path.startsWith('/home') && role != "customer")
    return next('/admin')
  
  next();
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
