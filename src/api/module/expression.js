import ax from '../axios';

//删除用户
export function queryLessonHistory(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/expression/queryLessonHistory.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
