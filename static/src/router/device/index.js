export default [{
    path: '/device',
    name: "device",
    component: () => import('@/views/device'),
    meta: {
      title: "手环设备列表",
      keepAlive: true,
      isShare: false,
    }
  },
  {
    path: '/device/search',
    name: "deviceSearch",
    component: () => import('@/views/device/search'),
    meta: {
      title: "设备搜索",
      keepAlive: true,
      isShare: false,
    }
  },
  {
    path: '/device/studentList',
    name: "deviceSearch",
    component: () => import('@/views/device/studentList'),
    meta: {
      title: "手环绑定",
      keepAlive: false,
      isShare: false,
    }
  },
  {
    path: '/device/add',
    name: "deviceSearch",
    component: () => import('@/views/device/add'),
    meta: {
      title: "添加孩子",
      keepAlive: false,
      isShare: false,
    }
  },
]
