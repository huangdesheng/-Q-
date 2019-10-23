import ax from '../axios';

//学生课程列表查询
export function lessonQuery(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/expression/lessonQuery.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//课程成绩查询列表
export function lessonScoreQuery(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/expression/lessonScoreQuery.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//试卷列表查询
export function examPaperQuery(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/exam/examPaperQuery.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//试卷详情查询
export function examPaperDetail(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/exam/examPaperDetail.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//试卷评论查询
export function examPaperCommentQuery(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/exam/examPaperCommentQuery.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//试卷评论提交
export function examPaperComment(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/exam/examPaperComment.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询课程列表
export function lessonInfoQuery(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/expression/lessonInfoQuery.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//检查用户是否绑定手环
export function checkBindBracelet(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/expression/checkBindBracelet.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//检查用户是否绑定手环
export function lessonList(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/expression/lessonList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//其他学校试卷列表查询
export function queryOtherSchool(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/expression/queryOtherSchool.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
