export default [{
  path: '/edu-recommend',
  name: "eduRecommend",
  component: () => import('@/views/edu-recommend'),
  meta: {
    title: "教育推荐",
    keepAlive: true,
    isShare: false,
  }
}]
