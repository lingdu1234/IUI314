/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-03 16:28:26
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-11-24 11:26:05
 * @FilePath: \IUI314\src\stores\modules\userInfo.ts
 * @Description: userInfo
 */
import md5 from 'blueimp-md5'
import { defineStore } from 'pinia'

import { getFullUserInfo, loginUser, logOutUser } from '@/api/system/login'
import { freshToken } from '@/api/system/user'
import defaultAvatar from '@/assets/av.webp'
import type { LoginForm, LoginFormLocal, LocalUser } from '@/types/base/login'

import { usePermissionStore } from './permission'

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
    // 设置本地登录信息
    setLocalUserInfo(userInfo: LocalUser) {
      this.localUserInfo.username = userInfo.user_name
      this.localUserInfo.password = userInfo.user_password
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
    async frontEndLogout() {
      this.token = {
        type: '',
        value: '',
        expires: 0,
        exp_in: 0,
      }
      // 重置为登录状态，下次进入路由刷新路由表
      usePermissionStore().setIsReloading(true)
    },
    // 登出系统
    async logOut() {
      await logOutUser()
      await this.frontEndLogout()
    },
  },
})
