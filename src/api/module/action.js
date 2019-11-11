import ax from '../axios';

//行为添加
export function actionAdd(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/expression/actionAdd.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//按行为查询规则
export function actionQuery(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/expression/actionQuery.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//行为删除
export function actionDelete(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/expression/actionDelete.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//行为编辑
export function actionUpdate(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/expression/actionUpdate.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//行为标准关联
export function ruleConnect(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/expression/ruleConnect.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//行为标准增加
export function ruleAdd(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/expression/ruleAdd.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//行为标准删除
export function ruleDelete(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/expression/ruleDelete.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//行为列表查询
export function actionListQuery(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/expression/actionListQuery.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//行为打星
export function actionStrike(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/expression/actionStrike.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//历史打星
export function actionStrikeList(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/expression/actionStrikeList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//历史打星查询
export function historyStrikeQuery(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/expression/historyStrikeQuery.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询行为标准列表是否关联
export function queryStudentRule(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/expression/queryStudentRule.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询未选中的自定义行为
export function queryStudentActionList(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/expression/queryStudentActionList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询未选中的默认行为
export function queryStudentActionDefaultList(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/expression/queryStudentActionDefaultList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询未选中的默认行为
export function queryMyAction(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/expression/queryMyAction.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//系统默认行为列表
export function queryAllActionDefualt(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/expression/queryAllActionDefualt.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询最新Q星数
export function queryStar(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/expression/queryStar.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//添加行为备注
export function remarks(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/expression/remarks.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//已坚持习惯天数
export function queryUserDay(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/expression/queryUserDay.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
