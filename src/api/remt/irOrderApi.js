import request from '@/utils/request'
import { formDataHeaders, headers,jsonHeaders } from '@/api/api_header_conf'

/**
 * 分页获取订单管理数据
 * @param {*} data 
 */
export function pageList(data){
  return request({
    headers,
    url:'/irOrder-mng',
    method:'post',
    data
  })
}

/**
 * 新增订单管理信息
 * @param {*} data
 */
export function add(data) {
  return request({
    headers,
    url: '/irOrder-mng/add',
    method: 'post',
    data
  })
}

/**
 * 修改订单管理信息
 * @param {*} data 
 */
export function update(params) {
  return request({
    headers,
    url: '/irOrder-mng',
    method: 'put',
    data:params
  })
}

/**
 * 获取订单管理信息
 * @param {*} id 
 */
export function details(params) {
  return request({
    headers,
    url: '/irOrder-mng/getById',
    method: 'get',
    params:params
  })
}

/**
 * 删除订单管理信息
 * @param {*} id
 */
export function deleteInfo(id) {
  return request({
    headers,
    url: '/irOrder-mng/' + id,
    method: 'delete'
  })
}
