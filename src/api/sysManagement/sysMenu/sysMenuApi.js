import request from '@/utils/request'
import { headers } from '@/api/api_header_conf'
/**
 * 获取菜单树
 */
export function loadMenuTree() {
  return request({
    headers,
    url: '/menu/tree',
    method: 'get'
  })
}

export function saveMenu(data) {
  return request({
    headers,
    url: '/menu',
    method: 'post',
    data: data
  })
}

export function updateMenu(data) {
  return request({
    headers,
    url: '/menu',
    method: 'put',
    data: data
  })
}

export function queryMenuById(id) {
  return request({
    headers,
    url: `/menu/${id}`,
    method: 'get'
  })
}

export function deleteMenu(id,deleteLowCodePage) {
  return request({
    headers,
    url: `/menu/${id}/${deleteLowCodePage}`,
    method: 'delete'
  })
}

export function queryMenus(param) {
  return request({
    headers,
    url: `/menu`,
    method: 'get',
    params: param
  })
}

export function getMenusId(code) {
  return request({
    headers,
    url: `/menu/menus-id/${code}`,
    method: 'get'
  })
}

export function verify(param) {
  return request({
    headers,
    url: `/menu/validation`,
    method: 'get',
    params: param
  })
}


/**
 * 菜单详情
 * @param {*} param 
 */
export function details(param) {
  return request({
    headers,
    url: `/menu/details`,
    method: 'get',
    params: param
  })
}
