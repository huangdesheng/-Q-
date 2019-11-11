export default [{
    path: '/signature',
    name: 'signature',
    component: () => import('@/views/signature'),
    meta: {
      title: "签名",
      keepAlive: false,
      isShare: false,
    }
  }]
  