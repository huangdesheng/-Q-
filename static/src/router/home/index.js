export default [{
  path: '/home',
  name: 'home',
  component: () => import('@/views/home'),
  meta: {
    keepAlive: true,
    isShare: true,
    title: '小Q班级',
  }
}]
