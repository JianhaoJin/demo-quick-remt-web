import request from '@/utils/request'
import { headers } from '@/api/api_header_conf'

/**
 * 银行信息-分页查询
 * @param {*} data
 */
export function pageList(data) {
  return request({
    headers,
    url: `/bic-mng/page`,
    method: 'post',
    data
  })
}


