export default [{
  path: '/not-found',
  name: 'notFound',
  component: () => import('@/views/not-found'),
  meta: {
    keepAlive: false,
    isShare: false,
    title: '链接失效',
    roles: [1, 2, 3]
  }
}]
