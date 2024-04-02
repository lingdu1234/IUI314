/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-03 16:28:26
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\stores\modules\userInfo.ts
 * @Description: userInfo
 */
import md5 from 'blueimp-md5'
import { defineStore } from 'pinia'

import { unref } from 'vue'
import { usePermissionStore } from './permission'
import defaultAvatar from '@/assets/av.webp'
import { useEncrypt, useGet, usePost, usePut } from '@/hooks'
import type { FullUserInfo, LoginForm, LoginFormLocal, TokenInfo } from '@/types/base/login'
import { ApiSysLogin, ApiSysUser } from '@/api/sysApis'

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
      const { encrypt } = useEncrypt()
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
      const { data, execute } = usePost<TokenInfo>(ApiSysLogin.login, user_data)
      await execute()
      const token = unref(data) as TokenInfo
      this.token = {
        value: token.token,
        expires: token.exp,
        exp_in: token.exp_in,
        type: token.token_type,
      }
    },
    // 获取用户信息
    async getUserInfo(): Promise<boolean> {
      const { data, execute } = useGet<FullUserInfo>(ApiSysLogin.getUserInfo, null, { refetch: false })
      await execute()
      const user = data.value
      if (user) {
        this.user = {
          name: user.user.user_name,
          avatar:
              user.user.avatar === '' || user.user.avatar == null
                ? defaultAvatar
                : import.meta.env.VITE_API_BASE_URL + user.user.avatar,
          roles: user.roles,
          role: user.user.role_id,
          depts: user.depts,
          dept: user.user.dept_id,
          uid: user.user.id,
          permissions: user.permissions,
        }
        return true
      }
      else {
        return false
      }
    },
    // 获取本地用户信息
    getLocalUserInfo() {
      const { decrypt } = useEncrypt()
      return {
        user_name: decrypt(this.localUserInfo.username) as string,
        user_password: decrypt(this.localUserInfo.password) as string,
      }
    },
    // 刷新token
    async freshToken() {
      const { data, execute } = await usePut<TokenInfo>(ApiSysUser.freshToken)
      await execute()
      const token = unref(data) as TokenInfo
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
      const { execute } = usePost(ApiSysLogin.logOut)
      await execute()
      await this.frontEndLogout()
    },
  },
})
