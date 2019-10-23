export default [{
    path: '/',
    redirect: '/action'
  }, {
    path: '/action',
    name: 'action',
    component: () => import('@/views/action'),
    meta: {
      title: "行为管理",
      keepAlive: false,
      isShare: false,
    }
  },
  {
    path: '/action/add',
    name: 'actionAdd',
    component: () => import('@/views/action/add'),
    meta: {
      title: "添加行为",
      keepAlive: false,
      isShare: false,
    }
  },
  {
    path: '/action/edit',
    name: 'actionEdit',
    component: () => import('@/views/action/edit'),
    meta: {
      title: "编辑行为",
      keepAlive: false,
      isShare: false,
    }
  },
  {
    path: '/actionHistory',
    name: 'actionHistory',
    component: () => import('@/views/action/history'),
    meta: {
      title: "历史行为",
      keepAlive: false,
      isShare: false,
    }
  }
]
