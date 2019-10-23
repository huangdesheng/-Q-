import service from "@/api";
const actions = {
  //版本跳转-从体验用户跳转到小Q表现或个人中心
  async myExperience({
    dispatch
  }, params) {
    return new Promise(async resolve => {
      let res = await service.myExperience(params);
      if (res.errorCode === 0) {
        resolve(res.data);
      }
    })
  },
  //体验班
  async experience({
    dispatch
  }, params = {}) {
    return new Promise(async resolve => {
      let res = await service.experience(params);
      if (res.errorCode === 0) {
        resolve(res.data);
      }
    });
  }
}

export default {
  namespaced: true,
  actions
}
