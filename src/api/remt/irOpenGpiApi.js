import request from '@/utils/request'
import { headers } from '@/api/api_header_conf'

/**
 * 分页获取api管理数据
 * @param {*} data
 */
export function pageList(data) {
  return request({
   //headers,
    url: 'bank/easyInboundList',
    method: 'post',
    data
  })
}

/**
 * 获取GPI详情
 * @param {*} uetr
 */
export function details(data) {
  return request({
    //headers,
    url: 'bank/easyInboundDetail',
    method: 'post',
    data
  })
}
