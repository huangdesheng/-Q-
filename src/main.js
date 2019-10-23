import Vue from 'vue';
import App from './App';
import store from './store';
import router from './router';

Vue.config.productionTip = false;

import './filters'; //全局注册过滤器

import '@/vantUI'; //vant UI

import './permission'; //路由控制

// 根据路由设置标题
// router.beforeEach((to, from, next) => {
//   /*路由发生改变修改页面的title */
//   if(to.meta.title) {
//     document.title = to.meta.title
//   }
//   next();
// })

/* eslint-disable no-new */
new Vue({
  store,
  router,
  components: {
    App
  },
  template: '<App/>',
  mounted() {}
}).$mount('#app');
