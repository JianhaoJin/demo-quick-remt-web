import request from '@/utils/request'
import { headers } from '@/api/api_header_conf'

// 获取当前用户菜单
export function fetchMenusTree() {
  return request({
    headers,
    url: '/user/login-user/menus-tree',
    method: 'get'
  })
}

export function getUserList(params) {
  return request({
    headers,
    url: '/user',
    method: 'get',
    params: params
  })
}

export function addUser(data) {
  return request({
    headers,
    url: '/user',
    method: 'post',
    data: data
  })
}

export function deleteUser(id) {
  return request({
    headers,
    url: `/user/${id}`,
    method: 'delete'
  })
}

export function updateUser(data) {
  return request({
    headers,
    url: '/user',
    method: 'put',
    data: data
  })
}

export function initPassword(id) {
  return request({
    headers,
    url: `/user/reset-password/${id}`,
    method: 'post'
  })
}

export function getUsersByRoleCode(param) {
  return request({
    headers,
    url: `/user/role-code`,
    method: 'get',
    params: param
  })
}

export function getUsersNotRoleId(param) {
  return request({
    headers,
    url: `/user/role-id`,
    method: 'get',
    params: param
  })
}

/**
 * 验证用户是否存在
 * @param {*} param
 */
export function checkUsername(username) {
  return request({
    headers,
    url: `/user/userCheck/` + username,
    method: 'get'
  })
}

/**
 * 获取用户树信息
 * @param {*} param
 */
export function treeUsers() {
  return request({
    headers,
    url: `/user/treeUsers/`,
    method: 'get'
  })
}

/**
 * 修改密码
 * @param {*} data
 */
export function changePwd(data) {
  return request({
    headers,
    url: `/user/change-pwd/`,
    method: 'put',
    data: data
  })
}

/**
 * 分页人员
 * @param {*} data 
 */
export function personList(data){
  return request({
    headers,
    url:"/user/page",
    method:"get",
    params:data
  })
}
/**
 * 重置密码
 * @param {*} data 
 */
export function resetPwd(jobNumber){
  return request({
    headers,
    url:"/user/reset-pwd/"+jobNumber,
    method:"get"
  })
}
/**
 * 修改用户状态
 * @param {*} jobNumber 
 */
export function changeStatus(jobNumber){
  return request({
    headers,
    url:"/user/status/"+jobNumber,
    method:"get"
  })
}