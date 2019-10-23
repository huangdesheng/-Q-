import ax from '../axios';

//老师列表
export function queryTeacherFeedList(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/interaction/studentInteractionList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

//与老师聊天详情
export function queryTeacherFeedDetails (params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/interaction/queryTeacherInteractionInfo.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

//与老师的聊天发送
export function queryTeacherFeedSeed (params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/interaction/teacherReplyStudent.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

//学生模糊查询
export function studentInquire (params, config = {
  // showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/interaction/queryStudentByStudentNameAndClassId.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}


//家长列表
export function queryFeedList(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/interaction/queryTeacherInteractionList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}


//年级选择
export function gradeSelect(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/queryClassNameList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

// //反馈意见列表（老师）
// export function queryTeacherFeedList(params, config = {
//   showLoading: true
// }) {
//   return ax.post('/qxiao-mp/action/mod-xiaojiao/feed/queryTeacherFeedList.do', params, config)
//     .then(res => res.data)
//     .catch(e => console.log(e));
// }
// //反馈意见列表（家长）
// export function queryStudentFeedList(params, config = {
//   showLoading: true
// }) {
//   return ax.post('/qxiao-mp/action/mod-xiaojiao/feed/queryStudentFeedList.do', params, config)
//     .then(res => res.data)
//     .catch(e => console.log(e));
// }
// //查询孩子所在班级的老师
// export function queryTeacherWithStudentId(params, config = {
//   showLoading: false
// }) {
//   return ax.post('/qxiao-mp/action/mod-xiaojiao/feed/queryTeacherWithStudentId.do', params, config)
//     .then(res => res.data)
//     .catch(e => console.log(e));
// }
// //新增意见反馈
// export function addFeedWithStudent(params, config = {
//   showLoading: true
// }) {
//   return ax.post('/qxiao-mp/action/mod-xiaojiao/feed/addFeedWithStudent.do', params, config)
//     .then(res => res.data)
//     .catch(e => console.log(e));
// }

// //新增师生互动
// export function addFeed(params, config = {
//   showLoading: true
// }) {
//   return ax.post('/qxiao-mp/action/mod-xiaojiao/feed/addFeed.do', params, config)
//     .then(res => res.data)
//     .catch(e => console.log(e));
// }

// //老师回复意见反馈
// export function teacherBack(params, config = {
//   showLoading: true
// }) {
//   return ax.post('/qxiao-mp/action/mod-xiaojiao/feed/teacherBack.do', params, config)
//     .then(res => res.data)
//     .catch(e => console.log(e));
// }
// //师生互动详情
// export function queryFeedDetail(params, config = {
//   showLoading: true
// }) {
//   return ax.post('/qxiao-mp/action/mod-xiaojiao/feed/queryFeedDetail.do', params, config)
//     .then(res => res.data)
//     .catch(e => console.log(e));
// }

// //家长互动
// export function studentAddFeed(params, config = {
//   showLoading: true
// }) {
//   return ax.post('/qxiao-mp/action/mod-xiaojiao/feed/studentAddFeed.do', params, config)
//     .then(res => res.data)
//     .catch(e => console.log(e));
// }
// //家长互动
// export function teacherAddFeed(params, config = {
//   showLoading: true
// }) {
//   return ax.post('/qxiao-mp/action/mod-xiaojiao/feed/teacherAddFeed.do', params, config)
//     .then(res => res.data)
//     .catch(e => console.log(e));
// }
