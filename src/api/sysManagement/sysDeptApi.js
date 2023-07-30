import request from '@/utils/request'
import { headers } from '@/api/api_header_conf'

/**
 * 加载部门
 * @param {*} param
 */
export function loadDeptData(param) {
  return request({
    headers,
    url: `/mcc-dept/page`,
    method: 'get',
    params: param
  })
}

export function listPage(param) {
  return request({
    headers,
    url: `/mcc-dept`,
    method: 'get',
    params: param
  })
}

export function removeById(id) {
  return request({
    headers,
    url: `/mcc-dept/${id}`,
    method: 'delete'
  })
}

export function updateDept(data) {
  return request({
    headers,
    url: `/mcc-dept`,
    method: 'put',
    data: data
  })
}

export function addDept(data) {
  return request({
    headers,
    url: `/mcc-dept`,
    method: 'post',
    data: data
  })
}

export function distrDpManagers(data) {
  return request({
    headers,
    url: `/mcc-dept/dpManager`,
    method: 'post',
    data: data
  })
}

export function queryDpManagers(param) {
  return request({
    headers,
    url: `/mcc-dept/dpManagers`,
    method: 'get',
    params: param
  })
}

export function deleteDpManager(id) {
  return request({
    headers,
    url: `/mcc-dept/dpManager/${id}`,
    method: 'delete'
  })
}

/**
 * 用户数据集合
 * @param {查询条件} params 
 */
export function loadUserDatas(params) {
  return request({
    headers,
    url: '/mcc-dept/users/page',
    method: 'get',
    params: params
  })
}





