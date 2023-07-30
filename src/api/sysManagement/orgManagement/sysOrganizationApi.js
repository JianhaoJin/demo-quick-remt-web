import request from '@/utils/request'
import { formDataHeaders, headers,jsonHeaders } from '@/api/api_header_conf'

// 查询机构(新接口)
export function fetchOrgTree() {
  return request({
    headers,
    url: '/organizations/tree',
    method: 'get'
  })
}

// 查询机构列表
export function fetchOrgList(query) {
  return request({
    headers,
    url: '/organizations',
    method: 'get',
    params: query
  })
}

// 新建机构
export function createOrg(data) {
  return request({
    headers,
    url: '/organizations',
    method: 'post',
    data
  })
}

// 修改机构
export function modifyOrg(data) {
  return request({
    headers,
    url: '/organizations',
    method: 'put',
    data: data
  })
}

// 删除机构
export function deleteOrg(orgId) {
  return request({
    headers,
    url: '/organizations/' + orgId,
    method: 'delete'
  })
}

/**
 * / 删除失效机构
 * @param {*} orgIds 
 */
export function removeDisabledOrg(orgIds) {
  return request({
    headers,
    url: '/organizations/disable/',
    method: 'delete',
    data: orgIds
  })
}


/**
 * 核查机构编码(10位)是否已存在
 * @param {*} orgCode 
 */
export function checkOrgCode(data) {
  return request({
    headers,
    url: '/organizations/org-code/',
    method: 'post',
    data: data
  })
}
