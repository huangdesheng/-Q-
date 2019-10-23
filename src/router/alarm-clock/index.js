export default [{
  path: '/alarm-clock',
  name: 'alarm-clock',
  component: () => import('@/views/alarm-clock'),
  meta: {
    title: "闹钟",
    keepAlive: false,
    isShare: false,
  }
}, {
  path: '/alarm-clock/add',
  name: 'alarm-clock/add',
  component: () => import('@/views/alarm-clock/add'),
  meta: {
    title: "添加闹钟",
    keepAlive: false,
    isShare: false,
  }
}]
