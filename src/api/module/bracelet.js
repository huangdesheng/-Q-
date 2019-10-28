import ax from '../axios';

//手环数据导入
export function braceletData(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/bralecet/braceletData.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

//查询学生课程活跃度数值
export function StudentLessonActive(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/device/StudentLessonActive.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
