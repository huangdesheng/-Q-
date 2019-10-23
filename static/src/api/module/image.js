import ax from '../axios';

//生成行为图片分享
export function actionImage(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/image/actionImage.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//生成历史行为图片分享
export function historyImage(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/image/historyImage.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
