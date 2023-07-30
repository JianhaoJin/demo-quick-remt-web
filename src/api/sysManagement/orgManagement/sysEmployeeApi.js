import request from '@/utils/request'
import { formDataHeaders, headers,jsonHeaders } from '@/api/api_header_conf'

// 获取员工列表
export function fetchEmployees(query) {
  const headers = formDataHeaders
  return request({
    headers,
    url: `/employees/page/${query.orgId}`,
    method: 'get',
    params: query
  })
}

// 获取员工列表
export function queryEmployeesByOrgId(query) {
  const headers = formDataHeaders
  return request({
    headers,
    url: `/employees/list/${query.orgId}`,
    method: 'get',
    params: query
  })
}

export function downloadApi(urlString) {
  return request({
    headers,
    url: '/employees/' + urlString,
    method: 'get',
    responseType: 'blob'
  }).then(res=>{
    const link = document.createElement("a");
    let download = res.headers['content-disposition'];
    download = decodeURI(download.substring(download.lastIndexOf('=') + 1));
    if('download' in link){ // 非ie下载
      link.style.display = "none";
      link.href = URL.createObjectURL(res.data);
      link.download = download;
      document.body.appendChild(link);
      link.click();
    }else{
      let blob = new Blob([res.data], {type: "application/vnd.ms-excel"});
      navigator.msSaveBlob(blob, download);
    }
  });
}
// 删除员工
export function deleteEmployee(data) {
  return request({
    headers,
    url: '/employees/',
    method: 'delete',
    data : data
  })
}

// 修改员工
export function modifyEmployee(data) {
  return request({
    headers,
    url: '/employees',
    method: 'put',
    data : data
  })
}


// 新增员工
export function createEmployee(data) {
  const headers = jsonHeaders
  return request({
    headers,
    url: '/employees',
    method: 'post',
    data
  })
}

export function isBadgeExist(badge) {
  return request({
    headers,
    url: '/employees/badge/' + badge,
    method: 'get'
  })
}
