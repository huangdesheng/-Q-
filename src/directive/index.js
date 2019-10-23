import Vue from 'vue';
import store from '@/store';
const role = Vue.directive('role', {
  //被绑定元素插入父节点时调用
  inserted: (el, binding, vnode) => {
    let {
      roleType
    } = store.getters;
    if (roleType === 1 || roleType === 4) {
      el.parentNode.removeChild(el);
    }
  }
});
export default {
  role
};
