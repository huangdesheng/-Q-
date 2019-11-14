import Cookies from 'js-cookie';

const state = {
  info: {}
};


const actions = {
  async setInfo({
    state,
    dispatch
  }, info) {
    console.log(info)
    return new Promise(async resolve => {
      state.info = Object.assign({}, info);
      //设置Cookie
      Cookies.set('info', info);
      console.log("setInfo");
      console.log(state.info);
      await dispatch("queryClass/queryClassId", info, {
        root: true
      });
      resolve({
        success: 'ok'
      });
    });
  },
  async getInfo({
    state,
    dispatch
  }) {
    //Cookies.getJSON
    let info = Cookies.getJSON('info') || {};
    console.log("getInfo");
    if (Object.keys(info).length) {
      state.info = info;
      console.log(state.info);
      await dispatch("queryClass/queryClassId", info, {
        root: true
      });
    }
  }
}


export default {
  namespaced: true,
  state,
  actions
}
