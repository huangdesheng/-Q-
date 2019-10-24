export default [{
    path: '/fresh',
    name: 'fresh',
    component: () => import('@/views/fresh'),
    meta: {
      keepAlive: false,
      isShare: false,
      title: '班级速报',
    }
  },
  {
    path: '/fresh/add',
    name: 'freshAdd',
    component: () => import('@/views/fresh/add'),
    meta: {
      keepAlive: false,
      isShare: false,
      title: '班级速报发布',
    }
  },
  {
    path: '/fresh/show',
    name: 'freshShow',
    component: () => import('@/views/fresh/show'),
    meta: {
      keepAlive: true,
      isShare: false,
      title: '速报详情',
    }
  },
]
