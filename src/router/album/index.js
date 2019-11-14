export default [{
    path: '/album',
    name: 'album',
    component: () => import('@/views/album'),
    meta: {
      keepAlive: true,
      isShare: false,
      title: '相册空间',
    }
  },
  {
    path: '/album/view',
    name: 'albumView',
    component: () => import('@/views/album/view'),
    meta: {
      keepAlive: true,
      isShare: false,
      title: '相册列表',
    }
  },
  {
    path: '/album/show',
    name: 'albumShow',
    component: () => import('@/views/album/show'),
    meta: {
      keepAlive: true,
      isShare: false,
      title: '相册详情',
    }
  },
  {
    path: '/album/add',
    name: 'albumAdd',
    component: () => import('@/views/album/add'),
    meta: {
      keepAlive: false,
      isShare: false,
      title: '相册上传',
    }
  },
  {
    path: '/album/sampling',
    name: 'sampling',
    component: () => import('@/views/album/sampling'),
    meta: {
      keepAlive: true,
      isShare: false,
      title: '采样详细',
    }
  },
  {
    path: '/album/addSampling',
    name: 'addSampling',
    component: () => import('@/views/album/addSampling'),
    meta: {
      keepAlive: false,
      isShare: false,
      title: '添加照片',
    }
  },
]
