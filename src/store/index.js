import Vue from 'vue';
import Vuex from 'vuex';


import queryClass from './modules/queryClass';
import user from './modules/user';
import experience from './modules/experience';

Vue.use(Vuex);


const store = new Vuex.Store({
  modules: {
    queryClass,
    user,
    experience
  }
});

export default store;
