/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-03 21:05:22
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-09 14:49:46
 * @FilePath: \IUI314\src\api\user.ts
 * @Description:
 */
/* eslint-disable no-unused-vars */

import { SysUserApi } from '@/api/apis'
import { usePut } from '@/hooks'
import type { TokenInfo } from '@/types/base/login'

/**
 * @description fresh token
 * @return {TokenInfo}
 */
export const freshToken = async (): Promise<TokenInfo> => {
  const { data, execute } = await usePut<TokenInfo>(SysUserApi.freshToken)
  await execute()
  return data.value!
}
