import { login, logout, getInfo } from '@/api/login'
import { freshToken} from '@/api/system/user'
import { getToken, setToken, removeToken,setTokenExp,removeTokenExp,setTokenExpStatus } from '@/utils/auth'
import defAva from '@/assets/images/profile.jpg'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    role:'',
    uid:'',
    permissions: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ROLE: (state, role) => {
      state.role = role
    },
    SET_UID: (state, uid) => {
      state.uid = uid
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then(res => {
          let exp = res.exp_in/1440 // 计算token过期时间 exp_in是分钟，除以1440转换成天
          setTokenExp(res.exp)
          setTokenExpStatus(1)
          setToken(res.token,exp)
          commit('SET_TOKEN', res.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    FreshToken({ commit }) {
      return new Promise((resolve, reject) => {
        freshToken().then(res => {
          let exp = res.exp_in/1440 // 计算token过期时间 exp_in是分钟，除以1440转换成天
          setTokenExp(res.exp)
          setTokenExpStatus(1)
          setToken(res.token,exp)
          commit('SET_TOKEN', res.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          const user = res.user
          // const avatar = user.avatar == "" ? defAva : import.meta.env.VITE_APP_BASE_API + user.avatar;
          const avatar = user.avatar == "" ? defAva : user.avatar;

          if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', res.roles)
            commit('SET_ROLE', res.user.role_id)
            commit('SET_UID', res.user.id)
            commit('SET_PERMISSIONS', res.permissions)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_NAME', user.user_name)
          commit('SET_AVATAR', avatar)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          removeTokenExp()
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
