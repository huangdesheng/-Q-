import ax from '../axios';

//速报列表查询
export function freshQuery(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/fresh/freshQuery.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//速报详情
export function freshDetail(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/fresh/freshDetail.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//速报评论人员查询
export function freshCommentQuery(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/fresh/freshCommentQuery.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//速报发送
export function freshAdd(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/fresh/freshAdd.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//速报评论发表
export function freshCommentAdd(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/fresh/freshCommentAdd.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除速报留言
export function deleteComment(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/fresh/deleteComment.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除速报
export function deleteFresh(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/fresh/deleteFresh.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
