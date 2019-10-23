import ax from '../axios';

//班级圈信息查询
export function communityQuery(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/community/communityQuery.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//发布班级圈
export function communityAdd(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/community/communityAdd.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//班级圈删除
export function communityDelete(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/community/communityDelete.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//班级圈点赞
export function communityPraise(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/community/communityPraise.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//班级圈评论
export function communityComment(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/community/communityComment.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
