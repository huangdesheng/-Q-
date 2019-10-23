export default [{
    path: '/course/view',
    name: 'courseView',
    component: () => import('@/views/course/view'),
    meta: {
      keepAlive: true,
      isShare: false,
      title: '课堂表现',
    }
  },
  {
    path: '/course/show',
    name: 'courseShow',
    component: () => import('@/views/course/show'),
    meta: {
      keepAlive: false,
      isShare: false,
    }
  },
  {
    path: '/course/history',
    name: 'courseHistory',
    component: () => import('@/views/course/history'),
    meta: {
      keepAlive: false,
      isShare: false,
      title: '课堂表现历史',
    }
  }
]
