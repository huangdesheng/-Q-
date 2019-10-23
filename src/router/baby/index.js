export default [{
    path: '/baby',
    name: 'baby',
    component: () => import('@/views/baby'),
    meta: {
      keepAlive: false,
      isShare: false,
      title: '学生列表',
    }
  },
  {
    path: '/baby/supply',
    name: 'babySupply',
    component: () => import('@/views/baby/supply'),
    meta: {
      keepAlive: false,
      isShare: false,
      title: '完善学生信息',
    }
  },
  {
    path: '/baby/add',
    name: 'babyAdd',
    component: () => import('@/views/baby/add'),
    meta: {
      keepAlive: false,
      isShare: false,
      title: '学生添加',
    }
  },
  {
    path: '/baby/edit',
    name: 'babyEdit',
    component: () => import('@/views/baby/edit'),
    meta: {
      keepAlive: false,
      isShare: false,
      title: '学生信息',
    }
  },
  {
    path: '/baby/share',
    name: 'babyShare',
    component: () => import('@/views/baby/share'),
    meta: {
      keepAlive: false,
      isShare: false,
      title: '分享',
    }
  }
]
