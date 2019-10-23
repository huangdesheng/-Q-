import ax from '../axios';

//多角色列表
export function queryRole(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/role/queryRole.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//返回首页
export function backPage(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/role/backPage.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
