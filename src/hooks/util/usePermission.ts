/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-11 15:46:58
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-11 16:34:02
 * @FilePath: \IUI314\src\hooks\util\usePermission.ts
 * @Description:
 */

import type { APIS } from '@/api/apis'
import { useUserStore } from '@/stores'

export const hasPermission = (...permissions: APIS[] | string[]): boolean => {
  const all_permision = '*:*:*'
  const userPermissions = useUserStore().user.permissions
  if (userPermissions.includes(all_permision)) return true
  let flag = true
  permissions.forEach((permission) => {
    const p = formatPermission(permission)
    console.log('p :>> ', p)
    if (!userPermissions.includes(p)) {
      flag = false
    }
  })
  return flag
}

const formatPermission = (p: string): string => {
  if (p.startsWith('/')) return p.replace('/', '')
  return p
}
