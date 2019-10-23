export default [{
    path: '/schoolCreate',
    name: 'schoolCreate',
    component: () => import('@/views/school/create'),
    meta: {
      keepAlive: false,
      isShare: false,
      title: '创建学校',
    }
  },
  {
    path: '/schoolJoin',
    name: 'schoolJoin',
    component: () => import('@/views/school/join'),
    meta: {
      keepAlive: false,
      isShare: false,
      title: '学校加入',
    }
  }
]
