import request from '@/utils/request'
import { headers } from '@/api/api_header_conf'

// 获取当前用户菜单
export function fetchRoleList(param) {
  return request({
    headers,
    url: '/role',
    method: 'get',
    params: param
  })
}

export function pushRole(data) {
  return request({
    headers,
    url: '/role',
    method: 'post',
    data: data
  })
}

export function removeRoleById(id) {
  return request({
    headers,
    url: `/role/${id}`,
    method: 'delete',
  })
}

export function updateRole(data) {
  return request({
    headers,
    url: '/role',
    method: 'put',
    data: data
  })
}

export function modifyMenuPermission(data) {
  return request({
    headers,
    url: '/role-menu',
    method: 'put',
    data: data
  })
}

export function deleteUserPermission(data) {
  return request({
    headers,
    url: '/role-user',
    method: 'delete',
    data: data
  })
}

export function addUserPermission(data) {
  return request({
    headers,
    url: '/role-user',
    method: 'post',
    data: data
  })
}

export function verifyRoleCode(param) {
  return request({
    headers,
    url: '/role/validation',
    method: 'get',
    params: param
  })
}

export function usersDomain(){
  return request({
    headers,
    url:"/role-user/usersDomain",
    method:"get"
  })
}

