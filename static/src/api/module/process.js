import ax from '../axios';

//查询学校模板
export function querySchoolName(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/process/querySchoolName.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//创建班级
export function addPlaySchoolWithTemplate(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/process/addPlaySchoolWithTemplate.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//体验接口
export function experience(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/experience/experience.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//学生加入班级
export function studentJoinClass(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/process/studentJoinClass.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//小Q表现学生加入班级
export function studentIdJoinClass(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/process/studentIdJoinClass.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//版本跳转
export function myExperience(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/experience/myExperience.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//二维码链接
export function getRQcode(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/upload/getRQcode.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
