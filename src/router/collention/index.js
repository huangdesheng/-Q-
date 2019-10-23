export default [{
  path: '/collention',
  name: "collention",
  component: () => import('@/views/collention'),
  meta: {
    title: "我的收藏",
    keepAlive: true,
    isShare: false,
  }
}]
