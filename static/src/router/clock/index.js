export default [{
    path: '/clock',
    name: 'clock',
    component: () => import('@/views/clock'),
    meta: {
      keepAlive: true,
      isShare: false,
      title: '考勤管理',
    }
  },
  {
    path: '/clock/show',
    name: 'clockShow',
    component: () => import('@/views/clock/show'),
    meta: {
      keepAlive: true,
      isShare: false,
      title: '考勤详情',
    }
  },
  {
    path: '/clock/view',
    name: 'clockView',
    component: () => import('@/views/clock/view'),
    meta: {
      keepAlive: true,
      isShare: false,
      title: '考勤统计详情',
    }
  },
  {
    path: '/clock/day',
    name: 'clockDay',
    component: () => import('@/views/clock/day'),
    meta: {
      keepAlive: true,
      isShare: false,
      title: '学生当天打卡记录',
    }
  },
]
