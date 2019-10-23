export default [{
  path: '/read-recommend',
  name: "activityRecommend",
  component: () => import('@/views/read-recommend'),
  meta: {
    title: "阅读推荐",
    keepAlive: true,
    isShare: false,
  }
}]
