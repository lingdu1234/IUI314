/* eslint-disable no-unused-vars */
import { ref } from 'vue'

import { useGet, usePost, usePut } from '@/hooks/util/useRequest'
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
