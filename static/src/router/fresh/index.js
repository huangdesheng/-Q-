export default [{
    path: '/fresh',
    name: 'fresh',
    component: () => import('@/views/fresh'),
    meta: {
      keepAlive: false,
      isShare: false,
      title: '新鲜速报',
    }
  },
  {
    path: '/fresh/add',
    name: 'freshAdd',
    component: () => import('@/views/fresh/add'),
    meta: {
      keepAlive: false,
      isShare: false,
      title: '新鲜速报发布',
    }
  },
  {
    path: '/fresh/show',
    name: 'freshShow',
    component: () => import('@/views/fresh/show'),
    meta: {
      keepAlive: true,
      isShare: false,
      title: '新鲜速报详情',
    }
  },
]
