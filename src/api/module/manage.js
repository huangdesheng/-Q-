import ax from '../axios';

//用户注册
export function registerUser(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/registerUser.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//用户登录
export function userTeleLogin(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/userTeleLogin.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//园所（学校）创建
export function schoolAdd(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/schoolAdd.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//园所（学校）修改
export function schoolUpdate(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/schoolUpdate.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//班级创建
export function classAdd(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/classAdd.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//班级删除
export function classDelete(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/classDelete.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//移除班级对应的老师
export function classMoveTeacher(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/classMoveTeacher.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询班级对应的老师
export function classQueryTeacher(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/classQueryTeacher.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//移除班级对应的学生
export function classMoveStudent(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/classMoveStudent.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询班级对应的学生
export function classQueryStudent(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/classQueryStudent.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//老师新增
export function teacherAdd(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/teacherAdd.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//学校老师列表
export function queryTeacher(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/queryTeacher.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//批量老师新增
export function teacherBatchAdd(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/teacherBatchAdd.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//老师修改
export function teacherUpdate(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/teacherUpdate.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//老师信息查询
export function teacherQuery(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/teacherQuery.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//老师删除
export function teacherDelete(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/teacherDelete.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//老师信息完善
export function teacherJoin(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/teacherJoin.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//学生信息完善
export function studentSupply(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/studentSupply.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//学生信息查询
export function studentQuery(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/studentQuery.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询学生信息--我的
export function studentQueryMe(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/studentQueryMe.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询学生列表--我的--切换
export function queryAllStudent(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/queryAllStudent.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//学生新增
export function studentAdd(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/studentAdd.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//批量学生新增
export function studentBatchAdd(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/studentBatchAdd.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//学生修改
export function studentUpdate(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/studentUpdate.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//学生删除
export function studentDelete(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/studentDelete.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//学生列表
export function queryStudentList(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/queryStudentList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询班级学生
export function queryStudentByClassId(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/queryStudentByClassId.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询班级学生(新)
export function queryStudentName(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/queryStudentName.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询老师管理的班级
export function queryClassNameList(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/queryClassNameList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询老师能预录入学生的班级
export function queryTeacherClass(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/queryTeacherClass.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询对应学校的所有班级
export function queryClass(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/queryClass.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询园长信息
export function queryInfo(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/queryInfo.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//根据学校Id码查询信息
export function queryBySchoolCode(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/queryBySchoolCode.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//根据学校Id码查询信息
export function querySchoolInfo(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/querySchoolInfo.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//根据类型查询相关班级
export function queryClassId(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/queryClassId.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//根据家长手机号查询相关班级
export function queryClassByTel(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/queryClassByTel.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//老师信息查询-我的
export function queryTeacherInfo(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/queryTeacherInfo.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询园长预先录入老师的信息
export function queryTeacherInfoByTel(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/queryTeacherInfoByTel.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//老师信息修改-我的
export function teacherInfoUpdate(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/updateMe.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//学生修改-我的
export function studentInfoUpdate(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/updateStudent.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//园长修改-我的
export function updateSchool(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/updateSchool.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询学生详细信息
export function studentInfoQuery(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/studentInfoQuery.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//控制家长端发布班级圈权限
export function updateIsOpen(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/updateIsOpen.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询学生相关班级
export function queryStudentClass(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/queryStudentClass.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//新增孩子
export function addStudentWithOpen(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/addStudentWithOpen.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询学生列表--开放版--切换
export function queryOpenStudentList(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/queryOpenStudentList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询存在的学生
export function queryStudentOpen(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/queryStudentOpen.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//老师录入学生（存在的学生）
export function addStudentWithStudentId(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/addStudentWithStudentId.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//学生删除（开放版）
export function deleteOpenStudent(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/deleteOpenStudent.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询学生列表--封闭版--切换
export function queryClassStudentList(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/queryClassStudentList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//根据家长id查所有孩子
export function queryStudentByParId(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/queryStudentByParId.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//根据家长id查所有孩子
export function joinStudent(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/joinStudent.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//最后登录状态
export function switchingState(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/switchingState.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//最后登录状态
export function queryGrade(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/queryGrade.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

//老师查询班级学生列表(20191006)
export function queryStudentStatusList(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/queryStudentStatusList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

// 查询学生家长电话(20191006)
export function queryStudentQP(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/queryStudentQP.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

// 新增师生互动(20191006)
export function addFeed(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/feed/addFeed.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

// 查询编辑学生资料
export function queryUpdateStudnetInfo(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/queryUpdateStudnetInfo.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

// 查询学生是否已录入（20191007）
export function queryStudentSame(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/queryStudentSame.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

// 查询学生家长的关系
export function queryStduentpar(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/manage/queryStduentpar.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

// 发送留言
export function teacherReplyStudent(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/interaction/teacherReplyStudent.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

// 删除学生的家长电话
export function deletePatriarchPhone(params, config = {
  showLoading: false
}) {
  return ax.post('qxiao-mp/action/mod-xiaojiao/manage/deletePatriarch.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}