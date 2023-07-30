import request from '@/utils/request'
import { headers } from '@/api/api_header_conf'

export function fetchJobList(query) {
  return request({
    headers,
    url: '/jobs/' + query.orgId,
    method: 'get',
    params: query
  })
}
export function jobList(query) {
  return request({
    headers,
    url: '/jobs/dept/' + query.deptId,
    method: 'get',
    params: query
  })
}
export function deleteJobs(data) {
  return request({
    headers,
    url: '/jobs',
    method: 'delete',
    data:data
  })
}

export function updateJob(data) {
  return request({
    headers,
    url: '/jobs',
    method: 'put',
    data: data
  })
}

export function addJob(data) {
  return request({
    headers,
    url: '/jobs',
    method: 'post',
    data: data
  })
}

export function isJobCodeExist(jobCode) {
  return request({
    headers,
    url: '/jobs/job-code/' + jobCode,
    method: 'get'
  })
}

/**
 * 将所选部门设置为失效状态
 * @param {*} data 
 */
export function setUpDeptDisable(data) {
  return request({
    headers,
    url: `/jobs/disable`,
    method: 'put',
    data: data
  })
}
