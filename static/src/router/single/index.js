export default [{
    path: '/',
    redirect: '/single'
  }, {
    path: '/single',
    name: 'single',
    component: () => import('@/views/single'),
    meta: {
      keepAlive: true,
      title: '小Q表现',
      isShare: false,
    }
  },
  {
    path: '/single/teacher',
    name: 'singleTeacher',
    component: () => import('@/views/single/teacher'),
    meta: {
      keepAlive: true,
      title: '小Q表现',
      isShare: false,
    }
  },
  {
    path: '/single/admin',
    name: 'singleAdmin',
    component: () => import('@/views/single/admin'),
    meta: {
      keepAlive: true,
      title: '小Q表现',
      isShare: false,
    }
  },
  {
    path: '/single/view',
    name: 'singleView',
    component: () => import('@/views/single/view'),
    meta: {
      keepAlive: true,
      title: '行为表现数据',
      isShare: false,
    }
  },
]
