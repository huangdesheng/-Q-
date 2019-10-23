import ax from '../axios';

//奖励添加接口
export function prizeAdd(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/prize/prizeAdd.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//奖励列表查询
export function prizeListQuery(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/prize/prizeListQuery.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//奖励删除接口
export function prizeDelete(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/prize/prizeDelete.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//奖励兑换
export function prizeExchange(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/prize/prizeExchange.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//兑奖记录查询
export function prizeExchangeLog(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/prize/prizeExchangeLog.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//获取可兑换星星数
export function queryTotalCountStar(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/prize/queryTotalCountStar.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
