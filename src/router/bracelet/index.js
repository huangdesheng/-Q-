export default [{
  path: '/bracelet',
  name: 'bracelet',
  component: () => import('@/views/bracelet'),
  meta: {
    title: "课堂专心度",
    keepAlive: true,
    cookie: true,
    isShare: false,
  }
}]
