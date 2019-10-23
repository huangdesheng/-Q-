export default [{
    path: '/feed',
    name: 'feed',
    component: () => import('@/views/feed'),
    meta: {
      title: "师生互动",
      keepAlive: false,
      isShare: false,
    }
  },
  {
    path: '/feed/teacher',
    name: 'feedTeacher',
    component: () => import('@/views/feed/teacher'),
    meta: {
      title: "师生互动",
      keepAlive: false,
      isShare: false,
    }
  },
  {
    path: '/feed/add',
    name: 'feedAdd',
    component: () => import('@/views/feed/add'),
    meta: {
      title: "新增互动",
      keepAlive: false,
      isShare: false,
    }
  },
  {
    path: '/feed/chat/',
    name: 'feedChat',
    component: () => import('@/views/feed/Chat'),
    meta: {
      title: "",
      keepAlive: false,
      isShare: false,
    }
  },
  {
    path: '/feed/chatTeacher/',
    name: 'chatTeacher',
    component: () => import('@/views/feed/chatTeacher'),
    meta: {
      title: "",
      keepAlive: false,
      isShare: false,
    }
  },
  // {
  //   path: '/feed/checkout',
  //   name: 'feedCheckout',
  //   component: () => import('@/views/feed/checkout'),
  //   meta: {
  //     title: "师生互动",
  //     keepAlive: false,
  //     isShare: false
  //   }
  // },
  // {
  //   path: '/feed/checkoutTeacher',
  //   name: 'feedCheckoutTeacher',
  //   component: () => import('@/views/feed/checkoutTeacher'),
  //   meta: {
  //     title: "师生互动",
  //     keepAlive: false,
  //     isShare: false
  //   }
  // }
]
