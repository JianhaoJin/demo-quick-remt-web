import request from '@/utils/request'
import { headers } from '@/api/api_header_conf'

/**
 * 分页获取api管理数据
 * @param {*} data
 */
export function pageList(data) {
  return request({
    headers,
    url: '/irGroup/page',
    method: 'post',
    data
  })
}
/**
 * 新增收汇分组管理信息
 * @param {*} data
 */
export function add(data) {
  return request({
    headers,
    url: '/irGroup',
    method: 'post',
    data
  })
}

/**
 * 修改收汇分组管理信息
 * @param {*} data
 */
export function update(params) {
  return request({
    headers,
    url: '/irGroup',
    method: 'put',
    data: params
  })
}

/**
 * 获取收汇分组管理信息
 * @param {*} id
 */
export function details(params) {
  return request({
    headers,
    url: '/irGroup/selectOne',
    method: 'get',
    params: params
  })
}

/**
 * 删除收汇分组管理信息
 * @param {*} id
 */
export function deleteInfo(id) {
  return request({
    headers,
    url: '/irGroup/' + id,
    method: 'delete'
  })
}
