export default [{
  path: '/punch',
  name: 'punch',
  component: () => import('@/views/punch'),
  meta: {
    keepAlive: true,
    isShare: false,
    title: '打卡接送',
  }
}]
