export default [{
    path: '/notice',
    name: 'notice',
    component: () => import('@/views/notice'),
    meta: {
      keepAlive: false,
      isShare: false,
      title: '通知公告',
      roles: [2, 3]
    }
  },
  {
    path: '/notice/admin',
    name: 'noticeAdmin',
    component: () => import('@/views/notice/admin'),
    meta: {
      keepAlive: true,
      isShare: false,
      title: '通知公告',
      roles: [1, 4]
    }
  },
  {
    path: '/notice/add',
    name: 'noticeAdd',
    component: () => import('@/views/notice/add'),
    meta: {
      keepAlive: false,
      isShare: false,
      title: '公告发布',
    }
  },
  {
    path: '/notice/show',
    name: 'noticeShow',
    component: () => import('@/views/notice/show'),
    meta: {
      keepAlive: true,
      isShare: false,
      title: '公告详情',
    }
  },
  {
    path: '/notice/read',
    name: 'noticeRead',
    component: () => import('@/views/notice/read'),
    meta: {
      keepAlive: false,
      isShare: false,
      title: '班级阅读情况',
    }
  },
  {
    path: '/notice/view-class',
    name: 'noticeViewClass',
    component: () => import('@/views/notice/view-class'),
    meta: {
      keepAlive: false,
      isShare: false,
      title: '班级阅读详情',
    }
  },
]
