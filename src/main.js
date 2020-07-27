import Vue from 'vue'
import Router from 'vue-router'
import { Button, Icon, Input, message } from 'ant-design-vue'
import routes from '../vue.routes'
import App from '@/App.vue'
import '../public/public.less'

Vue.use(Router)
Vue.use(Button)
Vue.use(Icon)
Vue.use(Input)
Vue.config.productionTip = false
Vue.prototype.$message = message;

const router = new Router({
  routes
})

router.beforeEach((to, from, next) => {
  const path = to.path;
  const token = localStorage.getItem('token');
  if (path === '/' && token) {
    next('/index')
  } else if (path === '/' && !token) {
    next();
  } else {
    if (!token) {
      next('/');
    }
  }
  
  if (to.meta && to.meta.key) {
    localStorage.setItem('activeKey', to.meta.key)
  }
  next();
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')