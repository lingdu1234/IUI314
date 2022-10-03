/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-03 09:17:21
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-03 23:33:47
 * @FilePath: \IUI314\src\types\base\login.ts
 * @Description:
 */

/**
 * @description: 验证码
 */
export interface codeData {
  captcha_on_off: boolean
  img: string
  uuid: string
}

/**
 * @description: login form data
 */
export interface LoginForm {
  user_name: string
  user_password: string
  code: string
  uuid: string
}

export interface LoginFormLocal extends LoginForm {
  rememberMe: boolean
}

/**
 * token info
 */
export interface TokenInfo {
  exp_in: number
  exp: number
  token: string
  token_type: string
}

// 完整用户信息
export interface FullUserInfo {
  user: User
  roles: string[]
  depts: string[]
  permissions: string[]
}

export interface User {
  id: string
  user_name: string
  user_nickname: string
  user_status: string
  user_email: string
  sex: string
  avatar: string
  dept_id: string
  remark: string
  is_admin: string
  phone_num: string
  role_id: string
  created_at: Date
  dept: Dept
}

export interface Dept {
  dept_id: string
  parent_id: string
  dept_name: string
  order_num: number
  leader: string
  phone: string
  email: string
  status: string
}
