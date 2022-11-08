/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-03 21:05:22
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\api\system\user.ts
 * @Description:
 */
/* eslint-disable no-unused-vars */

import { ApiSysUser } from '@/api/apis'
import { usePut } from '@/hooks'
import type { TokenInfo } from '@/types/base/login'

/**
 * @description fresh token
 * @return {TokenInfo}
 */
export const freshToken = async (): Promise<TokenInfo> => {
  const { data, execute } = await usePut<TokenInfo>(ApiSysUser.freshToken)
  await execute()
  return data.value!
}
