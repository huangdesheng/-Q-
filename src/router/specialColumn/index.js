export default [{
    path: '/specialColumn',
    name: 'specialColumn',
    component: () => import('@/views/specialColumn'),
    meta: {
      title: "园长专栏",
      keepAlive: false,
      isShare: false,
    }
  },
  {
    path: '/specialColumn/details',
    name: 'specialColumnDetails',
    component: () => import('@/views/specialColumn/details'),
    meta: {
      title: "专栏详情",
      keepAlive: false,
      isShare: false,
    }
  },
//   {
//     path: '/feed/add',
//     name: 'feedAdd',
//     component: () => import('@/views/feed/add'),
//     meta: {
//       title: "新增互动",
//       keepAlive: false,
//       isShare: false,
//     }
//   },
//   {
//     path: '/feed/chat/',
//     name: 'feedChat',
//     component: () => import('@/views/feed/Chat'),
//     meta: {
//       title: "",
//       keepAlive: false,
//       isShare: false,
//     }
//   },
//   {
//     path: '/feed/chatTeacher/',
//     name: 'chatTeacher',
//     component: () => import('@/views/feed/chatTeacher'),
//     meta: {
//       title: "",
//       keepAlive: false,
//       isShare: false,
//     }
//   },
]
