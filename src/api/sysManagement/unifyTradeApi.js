import request from '@/utils/request'
import { jsonHeaders } from '@/api/api_header_conf'

// 交易统一入口
export function saveUnifyTrade(data) {
  const headers = jsonHeaders
  return request({
    headers,
    url: '/unify-trade',
    method: 'post',
    data
  })
}