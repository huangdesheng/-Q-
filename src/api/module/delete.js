import ax from '../axios';

//删除用户
export function deleteUser(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/delete/deleteUser.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
