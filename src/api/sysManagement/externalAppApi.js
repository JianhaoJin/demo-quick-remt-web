import request from '@/utils/request'
import { headers } from '@/api/api_header_conf'

export function getPage(param) {
  return request({
    headers,
    url: `/external-app/page`,
    method: 'get',
    params: param
  })
}

export function deleteItem(id) {
  return request({
    headers,
    url: `/external-app/${id}`,
    method: 'delete'
  })
}

export function update(data) {
  return request({
    headers,
    url: `/external-app`,
    method: 'put',
    data: data
  })
}

export function add(data) {
  return request({
    headers,
    url: `/external-app`,
    method: 'post',
    data: data
  })
}

export function resetToken(id) {
  return request({
    headers,
    url: `/external-app/${id}/token`,
    method: 'put'
  })
}

export function pageApiList(id, param) {
  return request({
    headers,
    url: `/external-app/${id}/api/page`,
    method: 'get',
    params: param
  })
}

export function deleteApis(id, apiIds) {
  return request({
    headers,
    url: `/external-app/${id}/${apiIds}`,
    method: 'delete'
  })
}

export function addApis(id, apiIds) {
  return request({
    headers,
    url: `/external-app/${id}/${apiIds}`,
    method: 'post'
  })
}
