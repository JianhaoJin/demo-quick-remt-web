import request from '@/utils/request'
import { jsonHeaders, formDataHeaders, headers } from '@/api/api_header_conf'

// 分页查询字典类型
export function fetchDictentry(query) {
  return request({
    headers,
    url: '/dict-item',
    method: 'get',
    params: query
  })
}

// 新建字典类型
export function saveDictentry(data) {
  const headers = jsonHeaders
  return request({
    headers,
    url: '/dict-item',
    method: 'post',
    data
  })
}

// 修改字典类型
export function updateDicttype(data) {
  const headers = formDataHeaders
  return request({
    headers,
    url: '/dict-item',
    method: 'put',
    data
  })
}

// 删除字典
export function deleteDictentry(dictid) {
  const headers = formDataHeaders
  return request({
    headers,
    url: '/dict-item/' + dictid,
    method: 'delete'
  })
}

// 校验条目code是否存在
export function checkDictItemCode(code) {
  const headers = formDataHeaders
  return request({
    headers,
    url: '/dict-item/' + code,
    method: 'get'
  })
}

export function fetchDictItemByTypeCode(code) {
  return request({
    headers,
    url: `/dict-item/${code}`,
    method: 'get'
  })
}
