import request from '@/utils/request'
import {jsonHeaders, formDataHeaders, headers } from '@/api/api_header_conf'

// 分页查询字典类型
export function fetchDict(query) {
  return request({
    headers,
    url: '/dict-type',
    method: 'get',
    params: query
  })
}

// 新建字典类型
export function createDict(data) {
  const headers = jsonHeaders
  return request({
    headers,
    url: '/dict-type',
    method: 'post',
    data
  })
}

// 删除字典类型
export function deleteDicttype(dicttypeid) {
  const headers = formDataHeaders
  return request({
    headers,
    url: '/dict-type/' + dicttypeid,
    method: 'delete'
  })
}

// 修改字典类型
export function updateDicttype(data) {
  const headers = jsonHeaders
  return request({
    headers,
    url: '/dict-type',
    method: 'put',
    data
  })
}

// 校验类型code是否存在
export function checkDictCode(code) {
  const headers = formDataHeaders
  return request({
    headers,
    url: '/dict-type/check/' + code,
    method: 'get'
  })
}