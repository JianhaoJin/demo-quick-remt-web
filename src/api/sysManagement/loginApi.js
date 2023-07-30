import request from '@/utils/request'
import { formDataHeaders, headers } from '@/api/api_header_conf'
// 登陆 login
export function login(data) {
  return request({
    headers,
    url: '/login',
    method: 'post',
    data
  })
}
// 获取用户角色等信息
export function fetchUserInfo(query) {
  return request({
    headers,
    url: '/user/login-user',
    method: 'get',
    params: query
  })
}


// 获取用户授权菜单列表
export function fetchAuthMenu() {
  return request({
    headers,
    url: '/user/login-user/menus-tree',
    method: 'get'
  })
}

// 内管登出 logout
export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}

// origin
export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/login/login',
    method: 'post',
    data
  })
}

/**
 * 获取用户信息
 * @param {*} token 
 */
export function getUserInfo(token) {
  return request({
    url: '/user/login-user',
    method: 'get',
    params: { token }
  })
}

/**
 * 获取验证码
 * @param {*} token 
 */
export function getValidatedCode() {
  return request({
    url: '/validated-code',
    method: 'get'
  })
}
