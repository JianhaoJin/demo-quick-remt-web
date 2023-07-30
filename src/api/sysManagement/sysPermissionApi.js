import request from '@/utils/request'
import { headers } from '@/api/api_header_conf'


/**
 * 根据角色ID获取权限列表
 * @param {*} data 
 */
export function loadApibyRoleList(params){
  return request({
    headers,
    url:"/permission/page",
    method:"get",
    params:params
  })
}


/**
 * 根据角色ID获取权限列表
 * @param {*} params 
 */
export function loadApibyNotRoleList(params){
  return request({
    headers,
    url:"/permission/page-list",
    method:"get",
    params:params
  })
}


/**
 * 根据角色ID获取权限列表
 * @param {*} data 
 */
export function addApiPermission(data){
  return request({
    headers,
    url:"/permission",
    method:"post",
    data:data
  })
}

/**
 * 根据角色ID删除权限列表
 * @param {*} data 
 */
export function deleteApiPermission(data){
  return request({
    headers,
    url:"/permission",
    method:"delete",
    data:data
  })
}

