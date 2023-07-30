import request from '@/utils/request'
import { fireUpHeaders,headers } from '@/api/api_header_conf'

// 文件上传
export function fileUp(data) {
  const headers = fireUpHeaders
  return request({
    headers,
    url: '/file-up-down/up',
    method: 'post',
    data
  })
}
  /**
   * 查询回单下载编码
   * @param {*} data
   */
  export function receiptDownLoad(data) {
    return request({
      url: "bank/easyReceiptDownLoad",
      method: "post",
      data
    })
  }

  /**
   *回单，报文下载
   * @param {*} params
   */
  export function downLoad(params) {
    return request({
      url: "bank/downLoadFile",
      method: "get",
      params: params,
      responseType:'blob'
    })
  }

/**
 * 删除文件
 * @param {*} data 
 */
export function deleteUpFile(data){
  return request({
    headers,
    url:"/file-up-down",
    method:"delete",
    data:data
  })
}