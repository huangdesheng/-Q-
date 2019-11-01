import ax from '../axios';

//设备查询接口
export function queryData(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/data/queryData.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//设备查询接口
export function getDeviceStatus(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/device/getDeviceStatus.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//设备授权
export function deviceAuth(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/device/deviceAuth.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//绑定设备
export function bindDevice(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/device/bindDevice.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//解绑设备
export function unBindDevice(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/device/unBindDevice.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//获取设备电量
export function getElectric(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/device/getElectric.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//获取openId关联学生
export function getOpenIdRelationStudent(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/device/getOpenIdRelationStudent.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//返回活跃度目录数
export function getNumberActiveDirectory(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/device/getNumberActiveDirectory.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//解析数据包
export function parsePackets(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/device/parsePackets.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//解析数据包
export function parsePacketSleep(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/device/parsePacketSleep.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}


// 接收活跃度数据包
export function getReceptionActivityData(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/device/getReceptionActivityData.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

// base64解码
export function decoder(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/device/decoder.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

// 绑定设备
export function bindStudent(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/device/bindStudent.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

// 解析活跃度数据包
export function parsePacketActive(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/device/parsePacketActive.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

//查询当天运动步数 运动目标
export function getStepNumber(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/device/getStepNumber.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}


// 查询一周的历史步数
export function getStepNumberHistory(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/device/getStepNumberHistory.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

// 返回睡眠时长
export function getSleepTime(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/device/getSleepTime.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

// 查询一周的睡眠记录
export function getWeekSleep(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/device/getWeekSleep.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

//设置佩戴习惯
export function setMannerWear(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/device/setMannerWear.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

// 返回佩戴习惯
export function getMannerWear(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/device/getMannerWear.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

// 查询定义闹钟
export function getAlarmClock(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/device/getAlarmClock.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}


// 获取课程总Q星值
export function getStarTotal(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/device/getStarTotal.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}


// 查询学生课程活跃度数值
export function StudentLessonActive(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/device/StudentLessonActive.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

//获取用户绑定设备
export function getDeviceIdList(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/device/getDeviceIdList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
