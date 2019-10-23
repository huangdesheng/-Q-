export default [{
  path: '/login',
  name: 'login',
  component: () => import('@/views/login'),
  meta: {
    keepAlive: false,
    isShare: false,
    title: '登录',
  }
}]
