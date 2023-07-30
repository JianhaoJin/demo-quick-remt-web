import request from '@/utils/request'
import { formDataHeaders, headers,jsonHeaders } from '@/api/api_header_conf'

/**
 * 汇入汇款分页查询数据
 * @param {*} data 
 */
export function pageList(data){
  console.log(data,'data')
  return request({
    headers,
    url:'/bank/inwardRemittanceQuery',
    method:'post',
    data
  })
}


/**
 * 汇入核销提交处理
 * @param {*} data 
 */
export function writeOffProc(params) {
  return request({
    headers,
    url: '/irOpen-mng/writeOff',
    method: 'post',
    data:params
  })
}

/**
 * 汇入认领提交处理
 * @param {*} data 
 */
export function claimProc(params) {
  return request({
    headers,
    url: '/irOpen-mng/claim',
    method: 'post',
    data:params
  })
}

/**
 * 根据业务键值获取汇入信息
 * @param {*} id 
 */
export function selectById(id) {
  return request({
    headers,
    url: '/irOpen-mng/selectById/' + id,
    method: 'get'
  })
}


