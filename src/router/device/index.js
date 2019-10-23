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
    path: '/device/studentList',
    name: "deviceSearch",
    component: () => import('@/views/device/studentList'),
    meta: {
      title: "我的手环",
      keepAlive: false,
      isShare: false,
    }
  },
  {
    path: '/checkSlepp',
    name: "checkSlepp",
    component: () => import('@/views/device/checkSlepp'),
    meta: {
      title: "昨晚睡眠",
      keepAlive: true,
      isShare: false,
    }
  },
  {
    path: '/checkStep',
    name: "checkStep",
    component: () => import('@/views/device/checkStep'),
    meta: {
      title: "今日步数",
      keepAlive: true,
      isShare: false,
    }
  },
  {
    path: '/checkActive',
    name: "checkActive",
    component: () => import('@/views/device/checkActive'),
    meta: {
      title: "活跃度",
      keepAlive: true,
      isShare: false,
    }
  },
  {
    path: '/setWear',
    name: "setWear",
    component: () => import('@/views/device/setWear'),
    meta: {
      title: "佩戴方式",
      keepAlive: false,
      isShare: false,
    }
  }
]
