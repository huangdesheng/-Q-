import ax from '../axios';

//公告通知列表查询
export function noticeQuery(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/notice/noticeQuery.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//公告通知详情
export function noticeDetail(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/notice/noticeDetail.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//公告阅读人员查询
export function noticeReaders(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/notice/noticeReaders.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//公告发送
export function noticeAdd(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/notice/noticeAdd.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//公告确认
export function noticeConfirm(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/notice/confirm.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//公告删除
export function deleteNotice(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/notice/deleteNotice.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//园长端--公告通知列表查询
export function querySchoolNotice(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/notice/querySchoolNotice.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//园长端--公告通知详情
export function querySchoolNoticeDefaul(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/notice/querySchoolNoticeDefaul.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//园长端--公告通知年级统计
export function queryleader(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/notice/queryleader.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//园长端--公告通知年级统计
export function queryClassNotice(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/notice/queryClassNotice.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
