export default [{
  path: '/community',
  name: 'community',
  component: () => import('@/views/community'),
  meta: {
    keepAlive: false,
    isShare: false,
    title: '班级圈发布',
  }
}]
