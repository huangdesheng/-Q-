export default [{
    path: '/recipe',
    name: 'recipe',
    component: () => import('@/views/recipe'),
    meta: {
      keepAlive: true,
      isShare: false,
      title: '营养食谱',
    }
  },
  {
    path: '/recipe/add',
    name: 'recipeAdd',
    component: () => import('@/views/recipe/add'),
    meta: {
      keepAlive: false,
      isShare: false,
      title: '营养食谱发布',
    }
  },
  {
    path: '/recipe/show',
    name: 'recipeShow',
    component: () => import('@/views/recipe/show'),
    meta: {
      keepAlive: true,
      isShare: false,
      title: '营养食谱详情',
    }
  },
]
