import request from '@/utils/request'
import { headers } from '@/api/api_header_conf'

/**
 * 供应商信息-分页查询
 * @param {*} data
 */
export function pageList(data) {
  return request({
    headers,
    url: `/recvr-mng/page`,
    method: 'post',
    data
  })
}

/**
 * 供应商信息-单笔查询
 * @param {*} param
 */
export function selectByIdObj(param) {
  return request({
    headers,
    url: `/recvr-mng/selectOne`,
    method: 'get',
    params: param
  })
}

/**
 * 供应商信息-单笔解锁
 * @param {*} id 
 */
export function unlockById(id) {
  return request({
    headers,
    url: `/recvr-mng/unlock/${id}`,
    method: 'get'
  })
}

/**
 * 供应商信息-单笔删除
 * @param {*} id 
 */
export function deleteById(id) {
  return request({
    headers,
    url: `/recvr-mng/${id}`,
    method: 'delete'
  })
}

/**
 * 供应商信息-修改
 * @param {*} data 
 */
export function update(data) {
  return request({
    headers,
    url: `/recvr-mng`,
    method: 'put',
    data: data
  })
}

/**
 * 供应商信息-新增
 * @param {*} data 
 */
export function add(data) {
  return request({
    headers,
    url: `/recvr-mng`,
    method: 'post',
    data: data
  })
}

