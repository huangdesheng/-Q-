export default [{
  path: '/user',
  name: "user",
  component: () => import('@/views/user'),
  meta: {
    title: "个人中心",
    keepAlive: false,
    isShare: true,
  }
}]
