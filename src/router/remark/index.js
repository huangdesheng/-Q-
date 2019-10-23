export default [{
  path: '/remark',
  name: 'remark',
  component: () => import('@/views/remark'),
  meta: {
    keepAlive: true,
    title: '评语列表',
    isShare: false,
  }
}]
