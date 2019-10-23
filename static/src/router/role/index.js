export default [{
    path: '/role',
    name: 'role',
    component: () => import('@/views/role'),
    meta: {
      keepAlive: false,
      title: '资料修改',
      isShare: false,
    }
  },
  {
    path: '/role/select',
    name: 'roleSelect',
    component: () => import('@/views/role/select'),
    meta: {
      keepAlive: false,
      title: '选择角色',
      isShare: false,
    }
  }
]
