import ax from '../axios';

//查询在家表现（表格接口）
export function queryActionListAdmin(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/director/queryActionList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询学校年级
export function queryGradeAdmin(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/director/queryGrade.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询在家表现（新图表接口）
export function queryPieChartAdmin(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/director/queryPieChart.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//班级使用情况（行为表现）
export function queryStudentDetailAdmin(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/director/queryStudentDetail.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询在校表现（表格接口）
export function queryLessonInSchoolAdmin(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/director/queryLessonInSchool.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//班级使用情况（在校表现）
export function queryLessonStudentStatisticsAdmin(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/director/queryLessonStudentStatistics.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
