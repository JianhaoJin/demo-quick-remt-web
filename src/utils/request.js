import axios from 'axios'
import { Message, MessageBox,Notification } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import setting from '@/settings'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.BASE_API, // api 的 base_url
 // baseURL: 'http://192.168.3.3:8999/api', // api 的 base_url
 baseURL: 'http://103.219.34.43:8999/api', 
  timeout: setting.requestTimeout, // request timeout
  validateStatus: status => { // 200、400、500
    return status == 200 || status == 400 || status == 401 || status == 500 || status == 204
  }
})

/**
 * header key值
 */
const header_key = setting.header_key
// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    //if (store.getters.token) {
      // 让每个请求携带token-- ['X-Access-Token']为自定义key 请根据实际情况自行修改
   //   config.headers[header_key] = store.getters.token
   // }else {
   //   config.headers[header_key] = getToken()
    //}
    if(localStorage.getItem("k3wise")){
      config.headers["k3wise"] = 1;
    }
    config.headers["token"] = localStorage.getItem("accessToken");

    // 防止IE浏览器get请求缓存
    if(config.method === 'get' && config.params) {
      config.params._t = Date.now()
    } else if(config.method === 'get' && !config.params) {
      if(config.url.indexOf('?') === -1) {
        config.url = config.url + '?_=' + (new Date().getTime())
      } else {
        config.url = config.url + '&_=' + (new Date().getTime())
      }
      
    }

    
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)


// response interceptor
// 返回报文拦截器 200/400/500/204状态码走response 其他走error
service.interceptors.response.use(response => {
  //重新给response中获取Token给赋值给当前Token,Token续约
    var hedaer = header_key.toLowerCase();
    var newToken = response.headers[hedaer];
    if(newToken){
      store.dispatch('ChangeToken', newToken).then(res => {
        console.log("token update success")
      }).catch(err =>{})
    }
    if(response.data.errorCode === '403'){
      MessageBox.confirm(response.data.errorMsg, {
        title: '警告',
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    } else if(response.data.errorCode === '401'){
      Notification({
        title: '警告',
        message:  response.data.errorMsg,
        type: 'warning'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload()
        })
      });
    }else if(response.status !== 200){
      if(response.data.type === 'application/json'){
        const reader = new FileReader()
        reader.onload = function(){
          let {errorMsg} = JSON.parse(reader.result)
          if(errorMsg===null || errorMsg ==="" || errorMsg ===undefined){
            errorMsg = "请求异常，请联系运维人员"
          }
          MessageBox.confirm(errorMsg, {
            title: '警告',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
        }
        reader.readAsText(response.data)
        return
      }
      let msg = response.data.errorMsg
      if(msg===null || msg ==="" || msg ===undefined){
        msg = "请求异常，请联系运维人员"
      }
      MessageBox.confirm(msg, {
        title: '警告',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    }
    return response
  },error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
