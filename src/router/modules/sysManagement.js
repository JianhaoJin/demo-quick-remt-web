
const sysManagement = {
  path: '/sysManagement',
  hidden: false,
  children: [
    // 子路由示例
    /**
    {
      path: 'newUser',
      hidden: true,
      component: () => import('@/views/mercurySysManagement/newUser'),
      name: 'newUser',
      needAuth: false,
      id: '001003',
      meta: { title: '编辑用户', noCache: true }
    }
    */
  ]
}

export default sysManagement
