import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'
import setting from '@/settings'



/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [

  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/Authredirect'),
    hidden: true
  },
  {
    path: '/alterPassword',
    component: () => import('@/views/userCenter/AlterPassword'),
    hidden: true,
    meta: { title: '修改密码', icon: 'component', noCache: true }
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '/refresh',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '',
        component: () => import('@/views/redirect/Refresh')
      }
    ]
  },
  /*
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'dashboard',
        meta: { title: '首页', icon: 'component', noCache: false }
      }
    ]
  },
  */
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: '/guide/index',
  //   hidden: setting.hiddenGuidePage,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/guide/index'),
  //       name: 'Guide',
  //       meta: { title: 'guide', icon: 'guide', noCache: false }
  //     }
  //   ]
  // },
  // {
  //   path: '/userCenter',
  //   component: Layout,
  //   alwaysShow: false,
  //   redirect: '/userCenter/userCenter',
  //   name: 'userCenter',
  //   needAuth: false,
  //   id: '-',
  //   meta: {
  //     title: '用户设置',
  //     icon: 'user'
  //   },
  //   children: [
  //     {
  //       path: 'userCenter',
  //       component: () => import('@/views/userCenter'),
  //       name: 'userCenter',
  //       needAuth: false,
  //       id: '-',
  //       meta: { title: '用户设置', noCache: false }
  //     }
  //   ]
  // },
  {
    path: '',
    component: Layout,
    redirect: '/irOpenQry',
    children: [
      {
        path: 'irOpenQry',
        component: () => import('@/views/remt/irmt/irOpenQry/index'),
        name: 'irOpenQry',
        meta: { title: '汇入汇款查询', icon: 'component', noCache: false }
      }
    ]
  },
  {
    path: '/recvrGpi',
    component: Layout,
    children: [
      {
        path: 'recvrGpi',
        component: () => import('@/views/remt/irmt/recvrGpi/index'),
        name: 'recvrGpi',
        meta: { title: 'GPI查询', icon: 'component', noCache: false }
      }
    ]
  },
  {
       path: '/dashboard',
       component: Layout,
       redirect: '/irOpenQry',
       children: [
         {
          path: '/irOpenQry',
           component: () => import('@/views/remt/irmt/irOpenQry/index'),
           name: 'irOpenQry',
          meta: { title: '汇入汇款查询', icon: 'component', noCache: false }
         }
       ]
    }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const router_vertical = new Router(
  {
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
  }
)

export const asyncRouterMap = [
  // sysManagementRouter,
  { path: '*', redirect: '/404', hidden: true, needAuth: false }
]

