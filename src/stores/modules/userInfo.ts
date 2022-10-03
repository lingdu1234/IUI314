/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-03 16:28:26
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-03 23:34:06
 * @FilePath: \IUI314\src\stores\modules\userInfo.ts
 * @Description: userInfo
 */
import md5 from 'blueimp-md5'
import { defineStore } from 'pinia'

import { getFullUserInfo, loginUser } from '@/api/login'
import { freshToken } from '@/api/user'
import defaultAvatar from '@/assets/av.webp'
import { useEncrypt } from '@/hooks/util/useEncrypt'
import type { LoginForm, LoginFormLocal } from '@/types/base/login'

const { encrypt, decrypt } = useEncrypt()

export const useUserStore = defineStore('userInfo', {
  state: () => ({
    token: {
      type: '',
      value: '',
      expires: 0,
      exp_in: 0,
    },
    localUserInfo: {
      username: '',
      password: '',
    },
    rememberMe: false,
    user: {
      name: '',
      avatar: '',
      roles: Array<string>(),
      role: '',
      depts: Array<string>(),
      dept: '',
      uid: '',
      permissions: Array<string>(),
    },
  }),
  persist: {
    paths: ['token', 'localUserInfo', 'rememberMe'],
  },
  actions: {
    // 登录
    async login(userInfo: LoginFormLocal) {
      this.rememberMe = userInfo.rememberMe
      if (this.rememberMe) {
        this.localUserInfo.username = encrypt(userInfo.user_name) as string
        this.localUserInfo.password = encrypt(userInfo.user_password) as string
      }
      const user_data: LoginForm = {
        user_name: userInfo.user_name,
        user_password: md5(userInfo.user_password),
        code: userInfo.code,
        uuid: userInfo.uuid,
      }
      const token = await loginUser(user_data)
      this.token = {
        value: token.token,
        expires: token.exp,
        exp_in: token.exp_in,
        type: token.token_type,
      }
    },
    // 获取用户信息
    async getUserInfo() {
      const user = await getFullUserInfo()
      if (user === undefined) return
      this.user = {
        name: user.user.user_name,
        avatar:
          user.user.avatar == '' || user.user.avatar == null
            ? defaultAvatar
            : import.meta.env.VITE_API_BASE_URL + user.user.avatar,

        roles: user.roles,
        role: user.user.role_id,
        depts: user.depts,
        dept: user.user.dept_id,
        uid: user.user.id,
        permissions: user.permissions,
      }
    },
    // 获取本地用户信息
    getLocalUserInfo() {
      return {
        user_name: decrypt(this.localUserInfo.username) as string,
        user_password: decrypt(this.localUserInfo.password) as string,
      }
    },
    // 刷新token
    async freshToken() {
      const token = await freshToken()
      this.token = {
        value: token.token,
        expires: token.exp,
        exp_in: token.exp_in,
        type: token.token_type,
      }
    },
    // 前端退出
    frontEndLogout() {
      this.token = {
        type: '',
        value: '',
        expires: 0,
        exp_in: 0,
      }
    },
  },
})
