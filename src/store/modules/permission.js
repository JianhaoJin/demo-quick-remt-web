import { constantRouterMap, asyncRouterMap ,a} from '@/router'
import Layout from '@/views/layout/Layout'


/**
 * 递归过滤授权的路由和菜单，返回后台授权通过的菜单
 * @param {*} authMenu 后端返回授权菜单
 */
function filterAuthorityRouter(authMenu) {
  const res = []
  for (let i = 0; i < authMenu.length; i++) {
    if (authMenu[i].parentId === '-1' && authMenu[i].type === '0') {
      res.push({
        path: authMenu[i].url,
        component: Layout,
        name : authMenu[i].code,
        redirect : authMenu[i].url + (authMenu[i].children.length != 0 ? authMenu[i].children[0].url : ''),
        meta: { title: authMenu[i].name, noCache: false, icon: authMenu[i].icon },
        children: getChildren(authMenu[i].children)
      })
    } 
  }
  return res
}


/**
 * 获取子路由
 * @param {*} childrens
 */
function getChildren(childrens){
  let res = [];
  for(let i = 0; i < childrens.length; i++){
    if (childrens[i].children.length > 0){
      let subMenu = {
        path: (childrens[i].url === '/' ? '' : childrens[i].url),
        component: {render:(e) => e("router-view")},
        redirect : childrens[i].children[0].url,
        name: childrens[i].code,
        meta: { title: childrens[i].name, icon: childrens[i].icon, noCache: true },
        children: getChildren(childrens[i].children)
      };
      res.push(subMenu);
    } else {
      let subMenu = {
        path: (childrens[i].url === '/' ? '' : childrens[i].url),
        component: () => import(`@/views${childrens[i].url}`),
        name: childrens[i].code,
        meta: { title: childrens[i].name, icon: childrens[i].icon, noCache: true },
        children: []
      };
      res.push(subMenu);
    }
  }
  return res;
}


const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    // SET_ROUTERS: (state, routers) => {
    //   state.addRouters = routers
    //   // state.routers = constantRouterMap.concat(routers)
    //   console.log(routers,'routers',constantRouterMap)
    //   state.routers = constantRouterMap.concat(routers)
    // }
  },
  actions: {
    GenerateRoutes({ commit }, menu) {
      return new Promise(resolve => {
        let accessedRouters = asyncRouterMap
        // 过滤后台授权的菜单和路由
        accessedRouters = asyncRouterMap.concat(filterAuthorityRouter(menu.data))
        // 动态添加路由
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
