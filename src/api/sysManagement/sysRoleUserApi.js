import request from '@/utils/request'
import { headers } from '@/api/api_header_conf'

// 根据角色获取当前角色下拥有的用户列表
export function loadUserByRoleData(param) {
  return request({
    headers,
    url: '/role-user',
    method: 'get',
    params: param
  })
}


// 根据角色获取当前角色下未拥有的用户列表
export function queryUserNotRoleId(param) {
  return request({
    headers,
    url: '/role-user/page',
    method: 'get',
    params: param
  })
}

//  角色用户授权，保存角色用户关系
export function saveUser(data) {
  return request({
    headers,
    url: '/role-user',
    method: 'post',
    data: data
  })
}


//删除用户授权，删除角色用户关系
export function deleteUserPermission(data) {
  return request({
    headers,
    url: '/role-user',
    method: 'delete',
    data: data
  })
}





