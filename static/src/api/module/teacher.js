import ax from '../axios';

//查询在家表现
export function queryActionWithHome(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/teacher/queryActionWithHome.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询在校表现
export function queryLessonWithSchool(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/teacher/queryLessonWithSchool.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询在家表现详细学生
export function queryStudentActionUsers(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/teacher/queryStudentActionUsers.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询在校表现详细学生
export function queryLessonStudent(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/teacher/queryLessonStudent.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询班级学生所有行为
export function classActionList(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/teacher/classActionList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//学生作品
export function queryWorkStudent(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/teacher/queryWorkStudent.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询在家表现（表格接口）
export function queryActionList(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/teacher/queryActionList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询在家表现（图表接口）
export function queryPieChart(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/teacher/queryPieChart.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//行为详情（新）
export function queryActionDetails(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/teacher/queryActionDetails.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//班级使用情况（行为表现）
export function queryStudentDetail(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/teacher/queryStudentDetail.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询在校表现（表格接口）
export function queryLessonInSchool(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/teacher/queryLessonInSchool.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//班级使用情况（在校表现）
export function queryLessonStudentStatistics(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/teacher/queryLessonStudentStatistics.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//课程详情（新）
export function queryLessonDetail(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/teacher/queryLessonDetail.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
