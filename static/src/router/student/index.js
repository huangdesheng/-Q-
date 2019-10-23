export default [{
    path: '/student',
    name: 'student',
    component: () => import('@/views/student'),
    meta: {
      keepAlive: false,
      isShare: true,
      title: '学生管理',
    },
  },
  {
    path: '/student/add',
    name: 'studentAdd',
    component: () => import('@/views/student/add'),
    meta: {
      keepAlive: false,
      isShare: false,
      title: '学生添加',
    }
  },
  {
    path: '/student/edit',
    name: 'studentEdit',
    component: () => import('@/views/student/edit'),
    meta: {
      keepAlive: false,
      isShare: false,
      title: '学生编辑',
    }
  },
]
