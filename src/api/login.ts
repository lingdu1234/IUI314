/* eslint-disable no-unused-vars */
/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-03 07:46:07
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-03 22:49:28
 * @FilePath: \IUI314\src\api\login.ts
 * @Description: login
 */

import { ref } from 'vue'

import { useGet, usePost } from '@/hooks/util/useRequest'
import type {
  codeData,
  FullUserInfo,
  LoginForm,
  TokenInfo,
} from '@/types/base/login'
import type { AppRouteRecordRaw } from '@/types/base/router'

/**
 * @description: Api
 */
enum Api {
  getCaptcha = '/comm/get_captcha',
  login = '/comm/login',
  getUserInfo = '/system/user/get_info',
  getRouters = '/system/menu/get_routers',
}

/**
 * 验证码
 */
export const useCaptcha = () => {
  const captchaData = ref<codeData | null>()

  /**
   * @description: 获取验证码
   */
  const getCaptcha = async () => {
    const { data, execute } = useGet<codeData>(Api.getCaptcha)
    await execute()
    captchaData.value = data.value
  }
  getCaptcha()
  return { captchaData, getCaptcha }
}

/**
 * user login
 * @param {LoginForm} user
 * @return {TokenInfo} token
 */
export const loginUser = async (user: LoginForm): Promise<TokenInfo> => {
  const { data, execute } = usePost<TokenInfo>(Api.login, user)
  await execute()
  return data.value!
}

/**
 * @description 获取完整用户信息
 * @return {FullUserInfo}
 */
export const getFullUserInfo = async (): Promise<FullUserInfo> => {
  const { data, execute } = useGet<FullUserInfo>(Api.getUserInfo)
  await execute()
  return data.value!
}

// 获取路由信息
export const getUserRouters = async (): Promise<AppRouteRecordRaw[]> => {
  const { data, execute } = useGet<AppRouteRecordRaw[]>(Api.getRouters)
  await execute()
  return data.value!
}
