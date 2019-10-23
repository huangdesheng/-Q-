export default [{
    path: '/class',
    name: 'class',
    component: () => import('@/views/class'),
    meta: {
      keepAlive: false,
      isShare: false,
      title: '班级管理',
    },
  },
  {
    path: '/class/edit',
    name: 'classEdit',
    component: () => import('@/views/class/edit'),
    meta: {
      keepAlive: true,
      isShare: false,
      title: '班级编辑',
    }
  },
  {
    path: '/class/add',
    name: 'classAdd',
    component: () => import('@/views/class/add'),
    meta: {
      keepAlive: true,
      isShare: false,
      title: '班级创建',
    }
  },
]
