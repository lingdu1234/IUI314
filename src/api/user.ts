/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-03 21:05:22
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-07 09:52:03
 * @FilePath: \IUI314\src\api\user.ts
 * @Description:
 */
/* eslint-disable no-unused-vars */
import { ref } from 'vue'

import { useGet, usePost, usePut } from '@/hooks'
import type { TokenInfo } from '@/types/base/login'

/**
 * @description: Api
 */
enum Api {
  freshToken = '/system/user/fresh_token',
}

/**
 * @description fresh token
 * @return {TokenInfo}
 */
export const freshToken = async (): Promise<TokenInfo> => {
  const { data, execute } = usePut<TokenInfo>(Api.freshToken)
  await execute()
  return data.value!
}
