import ax from '../axios';
// 查询学生家长的关系
export function queryStduentpar(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/queryStduentpar.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
