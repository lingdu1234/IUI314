import { login, logout, getInfo } from '@/api/login'
import { freshToken} from '@/api/system/user'
import { getToken, setToken, removeToken,setTokenExp,removeTokenExp,setTokenExpStatus } from '@/utils/auth'
import defAva from '@/assets/images/profile.jpg'

const useUserStore = defineStore(
  'user',
  {
    state: () => ({
      token: getToken(),
      name: '',
      avatar: '',
      roles: [],
      role:'',
      depts: [],
      dept:'',
      uid:'',
      permissions: []
    }),
    actions: {
      // 登录
      login(userInfo) {
        const username = userInfo.username.trim()
        const password = userInfo.password
        const code = userInfo.code
        const uuid = userInfo.uuid
        return new Promise((resolve, reject) => {
          login(username, password, code, uuid).then(res => {
            let exp = res.exp_in/1440
            setToken(res.token)
            setTokenExpStatus(1)
            setToken(res.token,exp)
            this.token = res.token
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
            this.token = res.token
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 获取用户信息
      getInfo() {
        return new Promise((resolve, reject) => {
          getInfo().then(res => {
            const user = res.user
            const avatar = (user.avatar == "" || user.avatar == null) ? defAva : import.meta.env.VITE_APP_BASE_API + user.avatar;

            if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
              this.roles = res.roles
              this.role = res.user.role_id
              this.depts = res.user.depts
              this.dept = res.user.dept_id
              this.uid = res.user.id
              this.permissions = res.permissions
            } else {
              this.setRoutes = ['ROLE_DEFAULT']
            }
            this.name = user.user_name
            this.avatar = avatar;
            resolve(res)
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 退出系统
      logOut() {
        return new Promise((resolve, reject) => {
          logout(this.token).then(() => {
            this.token = ''
            this.roles = []
            this.role = ''
            this.depts = []
            this.dept = ''
            this.permissions = []
            removeToken()
            removeTokenExp()
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      }
      // 前端 登出
      FedLogOut({ commit }) {
        return new Promise(resolve => {
          this.token = ''
          removeToken()
          resolve()
        })
      }
    }
  })

export default useUserStore
