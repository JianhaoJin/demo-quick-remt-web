import request from '@/utils/request'
import { headers } from '@/api/api_header_conf'

/**
 * 分页获取api管理数据
 * @param {*} data 
 */
export function pageList(params){
  return request({
    headers,
    url:"/api-management",
    method:"get",
    params:params
  })
}


/**
 * 修改api概要信息
 * @param {*} data 
 */
export function updateDesc(params) {
  return request({
    headers,
    url: '/api-management/' + params.id,
    method: 'put',
    params: params
  })
}

/**
 * 获取api详情信息
 * @param {*} id 
 */
export function details(id) {
  return request({
    headers,
    url: '/api-management/' + id,
    method: 'get',
  })
}
