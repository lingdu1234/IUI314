import request from '@/utils/request'

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    user_name: username,
    user_password: password,
    code,
    uuid
  }
  return request({
    url: '/comm/login',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/system/user/get_info',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/comm/get_captcha',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}