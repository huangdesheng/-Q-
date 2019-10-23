import ax from '../axios';

//查询定义闹钟
export function getAlarmClock(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/device/getAlarmClock.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}


//设置闹钟
export function addOrUpdateAlarmClock(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/device/addOrUpdateAlarmClock.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

// 查询闹钟个数
export function getAlarmClockCount(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/device/getAlarmClockCount.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}


// 查询闹钟详细
export function getAlarmId(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/device/getAlarmId.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
