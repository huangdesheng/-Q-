export default [{
    path: '/personality-plan',
    name: "personalityPlan",
    component: () => import('@/views/personality-plan'),
    meta: {
      title: "个性计划",
      keepAlive: true,
      isShare: false,
    }
  },
  {
    path: '/personality-plan/show',
    name: "personalityPlanShow",
    component: () => import('@/views/personality-plan/show'),
    meta: {
      title: "个性计划详情查看",
      keepAlive: true,
      isShare: false,
    }
  },
  // {
  //   path: '/personality-plan/show2',
  //   name: "personalityPlanShow2",
  //   component: () => import('@/views/personality-plan/show2'),
  //   meta: {
  //     title: "个性计划详情查看",
  //     keepAlive: true,
  //     cookie: true
  //   }
  // },
  // {
  //   path: '/personality-plan/show3',
  //   name: "personalityPlanShow3",
  //   component: () => import('@/views/personality-plan/show3'),
  //   meta: {
  //     title: "个性计划详情查看",
  //     keepAlive: true,
  //     cookie: true
  //   }
  // },
  // {
  //   path: '/personality-plan/show4',
  //   name: "personalityPlanShow4",
  //   component: () => import('@/views/personality-plan/show4'),
  //   meta: {
  //     title: "个性计划详情查看",
  //     keepAlive: true,
  //     cookie: true
  //   }
  // }
]
