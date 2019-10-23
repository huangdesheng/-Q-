import ax from '../axios';

//考勤打卡
export function punchClock(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/clock/punchClock.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//月考勤记录查询
export function clockQuery(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/clock/clockQuery.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//考勤统计查询
export function clockStat(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/clock/clockStat.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//实时接送接口
export function realShuttle(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/clock/realShuttle.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询班级当天打卡记录
export function classClockQuery(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/clock/classClockQuery.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//考勤统计详情
export function queryAttendance(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/clock/queryAttendance.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询学生当天打卡记录
export function clockQueryDate(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/clock/clockQueryDate.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询学生当天打卡记录
export function addPunch(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/clock/addPunch.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//改变学生出勤状态
export function changeStatus(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/clock/changeStatus.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//改变学生出勤状态
export function queryStudentPunchList(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/clock/queryStudentPunchList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//园长端考勤统计查询
export function clockStatWithSchool(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/clock/clockStatWithSchool.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
export function gradeDefual(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/clock/gradeDefual.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
