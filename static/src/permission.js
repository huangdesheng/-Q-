import router from './router';
import store from './store';
import Cookies from "js-cookie";
import {
  urlSearch
} from './utils/urlSearch';
import wxapi from "@/config/wxapi";

import {
  API_ROOT
} from "@/config/isdev";


router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  let {
    roleType,
  } = store.state.user.info;
  let _cookie = Cookies.getJSON('info') || {};
  //获取地址栏参数
  let params = urlSearch();
  //刷新操作
  if (Object.keys(_cookie).length && !roleType) {
    if (params != -1) {
      if (params.openId || params.roleType) {
        console.log(params);
        store.dispatch("user/setInfo", params);
      } else {
        store.dispatch("user/getInfo");
      }
    } else {
      store.dispatch("user/getInfo");
    }
  } else if (!Object.keys(_cookie).length && !roleType) {
    console.log("没有Cookie");
    if (to.path !== '/login') {
      //第一次进来
      if (params != -1) {
        store.dispatch("user/setInfo", params);
      }
    }
  }
  next();
});


//全局后置钩子
router.afterEach((to, from) => {
  //非ios设备，切换路由时候进行重新签名
  //if (window.__wxjs_is_wkwebview !== true) {}
  //if (window.__wxjs_is_wkwebview === true) {}
  //在不需要分享的页面统一处理    
  if (to.meta.isShare === false) {
    function wxShareAppMessage() {
      let option = {
        title: "亲爱的用户您好", // 分享标题
        desc: "小Q智慧欢迎您的加入", // 分享描述
        link: API_ROOT + "#/share", // 分享链接
        success: () => {},
        error: () => {}
      }
      wxapi.wxShareAppMessage(option);
    }
    wxapi.wxRegister(wxShareAppMessage);
  }
});

//error 
router.onError((error) => {
  console.log("异步组件时发生错误");
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  const targetPath = router.history.pending.fullPath;
  console.log(isChunkLoadFailed);
  console.log(targetPath);
  if (isChunkLoadFailed) {
    console.log("重新渲染目标页面");
    router.replace(targetPath);
  }
});
