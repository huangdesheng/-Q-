import ax from '../axios';

//用户注册
//首页1 公告2 速报3
export function registerUser() {
  //http://ax.qxiao.net/qxiao-mp/action/mod-xiaojiao/manage/registerUser.do?type=1 测试服务器
  //http://qxiaonmq.natapp1.cc/qxiao-mp/action/mod-xiaojiao/manage/registerUser.do?type=1 雷珍
  //http://qxiao.natapp1.cc/qxiao-mp/action/mod-xiaojiao/manage/registerUser.do?type=1  雪俊
  return ax.get('http://qxiaonmq.natapp1.cc/qxiao-mp/action/mod-xiaojiao/manage/registerUser.do?type=1')
    .then(res => res.data)
    .catch(e => console.log(e));
}
//手机验证码
export function telVeriftCode(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/telVeriftCode.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//用户登录
export function userTeleLogin(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/userTeleLogin.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
