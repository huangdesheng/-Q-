export default [{
  path: '/about',
  name: 'about',
  component: () => import('@/views/about'),
  meta: {
    title: "关于我们",
    keepAlive: false,
    isShare: false,
  }
}]
