import ax from '../axios';

//作业列表查询
export function homeworkQuery(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/homework/homeworkQuery.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//作业详情查询
export function homeworkDetail(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/homework/homeworkDetail.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//作业阅读人员查询
export function homeworkReaders(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/homework/homeworkReaders.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//作业发布
export function homeworkAdd(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/homework/homeworkAdd.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//作业删除
export function homeworkDelete(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/homework/homeworkDelete.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//作业阅读确认
export function homeWorkConfirm(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/homework/homeWorkConfirm.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
