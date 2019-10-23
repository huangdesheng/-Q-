import ax from '../axios';

//食谱列表查询
export function querySchoolRecipeList (params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/recipe/querySchoolRecipeList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//食谱详情查询
export function recipeDetail(params, config = {
  showLoading: false
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/recipe/recipeDetail.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//食谱发布
export function recipeAdd(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/recipe/recipeAdd.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除食谱
export function recipeDelete(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/recipe/recipeDelete.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//食谱详情
export function recipeInfo(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/recipe/recipeInfo.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//食谱阅读详情 园长、管理员端
export function queryRecipeLeader(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/recipe/queryRecipeLeader.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

//食谱阅读详情 老师、家长端
export function recipeQuery(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/recipe/recipeQuery.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}