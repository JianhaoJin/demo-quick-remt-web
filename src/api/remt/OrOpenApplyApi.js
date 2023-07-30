import request from '@/utils/request'
import { headers } from '@/api/api_header_conf'

/**
 * 分页获取api管理数据
 * @param {*} data 
 */
export function pageList(data){
  return request({
    headers,
    url:"/api-oropenapply",
    method:"post",
    data
  })
}
