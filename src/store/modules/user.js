import { login, logout, fetchUserInfo, fetchAuthMenu } from '@/api/sysManagement/loginApi'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { Message } from 'element-ui'
import store from '@/store'

const Qs = require('qs')
const user = {
  state: {
    user: '',   //用户信息
    username: '', // 账号名
    fullName: '', //姓名
    roles: [], // 用户角色列表
    roleIdx: 0, // 当前用户序号
    token: getToken(),
    department : '',
    token : '',
    org : '',
    orgid : '',
    job : '',
    permissionsCode : '',
    userGroupNo : '',
    addRouters : '',
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    },
    SET_USERGROUPNO: (state, userGroupNo) => {
      state.userGroupNo = userGroupNo
    },
    SET_FULLNAME: (state, fullName) =>{
      state.fullName = fullName
    },
    SET_ORG: (state, org) => {
      state.org = org
    },
    SET_ORGID :(state, orgid) => {
      state.orgid = orgid
    },
    SET_JOB: (state, job) => {
      state.job = job
    },
    SET_ROUTERS : (state,addRouters) =>{
      state.addRouters = addRouters
    },
    SET_DEPARTMENT: (state, department) => {
      state.department = department
    },
    SET_PERMISSIONS_CODE: (state, permissionsCode) => {
      state.permissionsCode = permissionsCode
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    }
  },

  actions: {

    /**
     * 用户登录
     * @param {*} param0 *
     * @param {*} userInfo 用户账号和密码
     */
    LoginByUsername({ commit, dispatch }, userInfo) {
      return new Promise((resolve, reject) => {
        let data = {
          username: userInfo.username,
          password: userInfo.password,
          validatedKey: userInfo.validatedKey,
          validatedCode: userInfo.validatedCode
        }
        login(data).then(res => {
          if (res.data.errorCode === '000000') {
             // 保存用户信息
             commit('SET_USERNAME', res.data.data.jobNumber);
             commit('SET_USERGROUPNO', res.data.data.userGroupNo);
             commit('SET_FULLNAME', res.data.data.fullName)
             commit('SET_ORG', res.data.data.orgDeptJobResponse.organizationResponse)
             commit('SET_JOB', res.data.data.orgDeptJobResponse.sysJobResponse)
             commit('SET_DEPARTMENT', res.data.data.orgDeptJobResponse.departmentResponse)
             commit('SET_ORGID', res.data.data.orgDeptJobResponse.organizationResponse ? 
             res.data.data.orgDeptJobResponse.organizationResponse.id : '') // 机构ID
             commit('SET_TOKEN', res.data.data.token)
             commit('SET_ROLES', res.data.data.roles)
             commit('SET_PERMISSIONS_CODE',res.data.data.permissionsCode)
             setToken(res.data.data.token)
            // resolve(res)
            dispatch('GetUserInfo').then(res => {
              resolve(res)
            })
          } else {
            resolve(res)
          }
        }).catch(error => {
          console.error("There was an error:",error)
          reject(error)
        })
      })
    },
    /**
     * 获取用户信息
     * @param {*} param0
     */
    GetUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        fetchUserInfo().then(res => {
          if (res.data.errorCode === '000000') {
             // 保存用户信息
            commit('SET_USERNAME', res.data.data.jobNumber);
            commit('SET_FULLNAME', res.data.data.fullName)
            commit('SET_ROLES', res.data.data.roles)
            commit('SET_PERMISSIONS_CODE',res.data.data.permissionsCode)
            resolve(res)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    /**
     * 获取用户授权菜单列表
     * @param {*} param0 *
     */
    GetUserMenu({ commit }) {
      return new Promise((resolve, reject) => {
        fetchAuthMenu().then(res => {
          if (!res) {
            Message({
              message: '该用户无菜单访问权限,请联系上级角色分配权限',
              type: 'warning'
            })
          }
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },


    /**
     * 修改Token
     * @param {*} param0 
     * @param {*} roleIdx 
     */
    ChangeToken({ commit, dispatch, state }, newToken) {
      commit('SET_TOKEN',newToken)
      setToken(newToken)
    },


    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          // location.reload()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },


    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }

  }
}

export default user
