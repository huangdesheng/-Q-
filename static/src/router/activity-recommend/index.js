export default [{
  path: '/activity-recommend',
  name: "activityRecommend",
  component: () => import('@/views/activity-recommend'),
  meta: {
    title: "活动推荐",
    keepAlive: true,
    isShare: false,
  }
}]
