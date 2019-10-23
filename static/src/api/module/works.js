import ax from '../axios';

//上传作品
export function uploadWorks(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/works/uploadWorks.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询审核通过上传作品
export function queryOnLineList(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/works/queryOnLineList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询我的上传作品
export function queryMyUpload(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/works/queryMyUpload.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除作品
export function deleteImage(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/works/deleteImage.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//上传接口
export function uploadFile(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/works/uploadFile.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//优秀作品
export function excellentWorks(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/works/excellentWorks.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//优秀作品
export function addPraise(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/works/addPraise.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
