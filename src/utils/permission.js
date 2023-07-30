import store from '@/store'
/**
 * 检验当前用户是否有按钮权限
 * @param {*} permission 
 */
export function hasPermission(permissionCode) {
  permissionCode = permissionCode.trim()
  let myPermissionsCode = store.getters.permissionsCode;
  if(!myPermissionsCode){
    return false;
  }
  return myPermissionsCode.indexOf(permissionCode) > -1;
 
}

