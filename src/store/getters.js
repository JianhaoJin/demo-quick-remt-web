
const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token, // 登录时保存，存的是用户的第一个角色ID，请求服务接口时放到header里
  name: state => state.user.username, // 登录时保存，存的用户ID，用于页面右上角显示
  permissionsCode: state => state.user.permissionsCode,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles, // 登录时保存，存的用户角色列表，用于根据角色查询菜单
  setting: state => state.user.setting,
  permission_routers: state => state.permission.routers, // 每次刷新页面时获取，用户有权限的路由菜单
  vertical_routers: state => state.permission.verticalRouters, // 每次路由跳转时 都调用接口取，纵向菜单，用于与横向菜单联动
  addRouters: state => state.permission.addRouters, // 每次刷新页面时获取，用户有权限的路由菜单
  errorLogs: state => state.errorLog.logs,
}
export default getters
