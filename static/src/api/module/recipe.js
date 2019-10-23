import ax from '../axios';

//食谱列表查询
export function recipeQuery(params, config = {
  showLoading: true
}) {
  return ax.post('/qxiao-mp/action/mod-xiaojiao/recipe/recipeQuery.do', params, config)
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
