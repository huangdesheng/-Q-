import ax from '../axios';

//获取openId关联学生（老师）
export function getOpenIdRelationStudent(params, config = {
  showLoading: true
}) {
  return ax.post('/action/mod-xiaojiao/device/getOpenIdRelationStudent.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
