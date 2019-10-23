export default [{
    path: '/child',
    name: 'child',
    component: () => import('@/views/child'),
    meta: {
      title: "关联孩子列表",
      keepAlive: false,
      isShare: false,
    }
  },
  {
    path: "/child/add",
    name: 'childAdd',
    component: () => import('@/views/child/add'),
    meta: {
      title: "添加",
      keepAlive: false,
      isShare: false,
    }
  },
  {
    path: "/child/edit",
    name: 'childEdit',
    component: () => import('@/views/child/edit'),
    meta: {
      title: "编辑",
      keepAlive: false,
      isShare: false,
    }
  }
]
