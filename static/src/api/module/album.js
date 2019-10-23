import ax from '../axios';

//查询相册所属班级
export function albumClassQuery(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/album/albumClassQuery.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询班级所属的相册栏目
export function albumChannelQuery(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/album/albumChannelQuery.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询相册栏目详情
export function albumChannelDetail(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/album/albumChannelDetail.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//相册照片或视频删除
export function imageDelete(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/album/imageDelete.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//相册图片或视频上传
export function albumImageAdd(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/album/albumImageAdd.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//新增栏目
export function addChannel(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/album/addChannel.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除栏目
export function deleteChannel(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/album/deleteChannel.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//修改栏目名称
export function updateChannel(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/album/updateChannel.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//修改栏目名称
export function queryTitle(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/album/queryTitle.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
