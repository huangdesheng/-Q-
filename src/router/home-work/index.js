export default [{
    path: '/home-work',
    name: 'homeWork',
    component: () => import('@/views/home-work'),
    meta: {
      keepAlive: false,
      isShare: false,
      title: "亲子作业",
    }
  },
  {
    path: '/home-work/show',
    name: 'homeWorkShow',
    component: () => import('@/views/home-work/show'),
    meta: {
      keepAlive: true,
      isShare: false,
      title: "作业详情",
    }
  },
  {
    path: '/home-work/add',
    name: 'homeWorkAdd',
    component: () => import('@/views/home-work/add'),
    meta: {
      keepAlive: false,
      isShare: false,
      title: "布置作业",
    }
  },
  {
    path: '/home-work/read',
    name: 'homeWorkRead',
    component: () => import('@/views/home-work/read'),
    meta: {
      keepAlive: false,
      isShare: false,
      title: "阅读详情",
    }
  },
]
