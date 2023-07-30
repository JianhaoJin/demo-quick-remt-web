import request from '@/utils/request'
import { formDataHeaders, headers,jsonHeaders } from '@/api/api_header_conf'

// -------------------部门接口-----------------
// 查询部门列表
export function fetchDepList(query) {
  return request({
    headers,
    url: '/departments/' + query.orgId,
    method: 'get',
    params: query
  })
}

// 修改部门
export function modifyDept(data) {
  return request({
    headers,
    url: '/departments',
    method: 'put',
    data
  })
}

// 新建部门
export function createDept(data) {
  const headers = jsonHeaders
  return request({
    headers,
    url: '/departments',
    method: 'post',
    data
  })
}

/**
 * 将所选部门设置为失效状态
 * @param {*} data 
 */
export function setUpDeptDisable(data) {
  return request({
    headers,
    url: `/departments/disable`,
    method: 'put',
    data: data
  })
}


/**
 * 删除部门
 * @param {*} data 
 */
export function deleteDep(data) {
  return request({
    headers,
    url: `/departments`,
    method: 'delete',
    data: data
  })
}

// 获取部门树结构
export function getDepTree(orgId) {
  return request({
    headers,
    url: '/departments/tree',
    method: 'get',
    params: { orgId: orgId }
  })
}
