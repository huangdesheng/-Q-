export default [{
    path: '/works',
    name: 'works',
    component: () => import('@/views/works'),
    meta: {
      title: "作品展",
      keepAlive: false,
      isShare: false,
    }
  },
  {
    path: '/works/add',
    name: 'worksAdd',
    component: () => import('@/views/works/add'),
    meta: {
      title: "作品上传",
      keepAlive: false,
      isShare: false,
    }
  },
  {
    path: '/works/view',
    name: 'worksView',
    component: () => import('@/views/works/view'),
    meta: {
      title: "我的上榜作品",
      keepAlive: false,
      isShare: false,
    }
  },
  {
    path: '/works/teacher',
    name: 'worksTeacher',
    component: () => import('@/views/works/teacher'),
    meta: {
      title: "学生作品",
      keepAlive: false,
      isShare: false,
    }
  }
]
