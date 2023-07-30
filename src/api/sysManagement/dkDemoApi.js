import request from '@/utils/request'
import { headers } from '@/api/api_header_conf'

//可用的担保信息以及CRE信息
export function usable2cre(param) {
  return request({
    headers,
    url: `/v1/bankEnterprise/guarantee/usable2cre`,
    method: 'post',
    data: param
  })
}
//银企外汇询价
export function quotedPrice(param) {
    return request({
      headers,
      url: `/v1/bankEnterprise/query/quotedPrice`,
      method: 'post',
      data: param
    })
}
//T0购汇点击成交交易
export function purchasing(param) {
    return request({
      headers,
      url: `/v1/bankEnterprise/spot/purchasing`,
      method: 'post',
      data: param
    })
}
//绿色通道
export function greenBenefit(param) {
  return request({
    headers,
    url: `/v1/bankEnterprise/query/greenBenefit`,
    method: 'post',
    data: param
  })
}
//交易查询
export function queryTrade(param) {
  return request({
    headers,
    url: `/v1/bankEnterprise/query/queryTrade`,
    method: 'post',
    data: param
  })
}
//非T0购汇点击成交交易
export function otherClickTrade(param) {
  return request({
    headers,
    url: `/v1/bankEnterprise/fx/otherClickTrade`,
    method: 'post',
    data: param
  })
}
//购汇查询交割日
export function queryDeliveryDate(param) {
  return request({
    headers,
    url: `/v1/bankEnterprise/query/queryDeliveryDate`,
    method: 'post',
    data: param
  })
}
//结售汇全额交割（额度关联）
export function quataAssociation(param) {
  return request({
    headers,
    url: `/v1/bankEnterprise/fx/quataAssociation`,
    method: 'post',
    data: param
  })
}
// 财资接口
//财资接口-可用的担保信息以及CRE信息
export function usable2creCZ(param) {
  return request({
    headers,
    url: `/v1/caizi/guarantee/usable2cre`,
    method: 'post',
    data: param
  })
}
//财资接口-银企外汇询价
export function quotedPriceCZ(param) {
  return request({
    headers,
    url: `/v1/caizi/query/quotedPrice`,
    method: 'post',
    data: param
  })
}
//财资接口-T0购汇点击成交交易
export function purchasingCZ(param) {
  return request({
    headers,
    url: `/v1/caizi/spot/purchasing`,
    method: 'post',
    data: param
  })
}
//财资接口-非T0购汇点击成交交易
export function otherClickTradeCZ(param) {
  return request({
    headers,
    url: `/v1/caizi/fx/otherClickTrade`,
    method: 'post',
    data: param
  })
}
//财资接口-购汇查询交割日
export function queryDeliveryDateCZ(param) {
  return request({
    headers,
    url: `/v1/caizi/query/queryDeliveryDate`,
    method: 'post',
    data: param
  })
}
//财资接口-交易查询
export function queryTradeCZ(param) {
  return request({
    headers,
    url: `/v1/caizi/query/queryTrade`,
    method: 'post',
    data: param
  })
}