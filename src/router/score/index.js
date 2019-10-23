export default [{
  path: '/score',
  name: 'score',
  component: () => import('@/views/score'),
  meta: {
    title: "考试成绩",
    keepAlive: true,
    isShare: false,
  }
}]
