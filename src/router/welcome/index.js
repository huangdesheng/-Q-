export default [{
  path: '/welcome',
  component: () => import('@/views/welcome'),
  meta: {
    title: "欢迎使用小Q智慧",
    keepAlive: true,
    isShare: false,
  }
}]
