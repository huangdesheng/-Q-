export default [{
    path: '/Handband',
    name: "Handband",
    component: () => import('@/views/Handband'),
    meta: {
      title: "手环绑定",
      keepAlive: true,
      isShare: false,
    }
  },
  {
    path: '/Handband/add',
    name: "Handband/add",
    component: () => import('@/views/Handband/add'),
    meta: {
      title: "手环绑定",
      keepAlive: true,
      isShare: false,
    }
  },
]
