import ax from '../axios';

//学生课程列表查询
export function queryScheduleList(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/schedule/queryScheduleList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//自制我的课表
export function addMySchedule(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/schedule/addMySchedule.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//编辑我的课表
export function updateMySchedule(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/schedule/updateMySchedule.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//课程列表
export function queryMySchedule(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/schedule/queryMySchedule.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//课程列表
export function queryLessonList(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/schedule/queryLessonList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//选中默认课表
export function checkedSchedule(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/schedule/checkedSchedule.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询课表状态
export function queryScheduleCheckedState(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/schedule/queryScheduleCheckedState.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除我的课表
export function deteleMySchedule(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/schedule/deteleMySchedule.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//新增班级课表(老师)
export function addSchedule(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/schedule/addSchedule.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询班级课表（老师）
export function queryClassSchedule(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/schedule/queryClassSchedule.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除班级课表（老师）
export function deteleSchedule(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/schedule/deteleSchedule.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//编辑班级课表（老师）
export function updateSchedule(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/schedule/updateSchedule.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
/** 20190828 **/
//添加家长自制课表可选课程
export function addMyLessonWithStudent(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/schedule/addMyLessonWithStudent.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//添加老师自制课表可选课程
export function addMyLessonWithClass(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/schedule/addMyLessonWithClass.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询家长自制课表可选课程
export function queryLessonWithStudentId(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/schedule/queryLessonWithStudentId.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询老师自制课表可选课程
export function queryLessonWithClassId(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/schedule/queryLessonWithClassId.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询班级自增课程
export function queryMyLessonByClassId(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/schedule/queryMyLessonByClassId.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询家长自增课程
export function queryMyLessonByStudentId(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/schedule/queryMyLessonByStudentId.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//编辑自增课程
export function updateMyLesson(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/schedule/updateMyLesson.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除自增课程
export function deleteMyLesson(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/schedule/deleteMyLesson.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//开始时间、课程时间
export function queryDefaulTime(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/schedule/queryDefaulTime.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//班级开始时间、课程时间
export function queryClassDefaul(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/schedule/queryClassDefaul.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
