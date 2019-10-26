import Vue from 'vue';
import App from './App';
import store from './store';
import router from './router';

Vue.config.productionTip = false;

import './filters'; //全局注册过滤器

import '@/vantUI'; //vant UI

import './permission'; //路由控制
// import './config/sdk';


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
