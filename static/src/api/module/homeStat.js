import ax from '../axios';

//在家表现一周查询
export function homeStatQuery(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/expression/homeStatQuery.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询课程列表
export function lessonInfoQuery(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/expression/lessonInfoQuery.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//课堂表现一周查询
export function stateMentList(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/expression/stateMentList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
