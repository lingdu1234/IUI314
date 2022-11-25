/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-11 15:46:58
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\hooks\util\usePermission.ts
 * @Description:
 */

import type { APIS } from '@/api/apis'
import { useUserStore } from '@/stores'

/**具有一个权限就返回True */
export const hasPermission = (...permissions: APIS[] | string[]): boolean => {
  const userPermissions = useUserStore().user.permissions
  if (IsSuperMan(userPermissions)) return true
  let flag = false
  permissions.forEach((permission) => {
    const p = formatPermission(permission)
    if (userPermissions.includes(p)) {
      flag = true
    }
  })
  return flag
}
/**具有所有权限才返回True */
export const hasPermissionALL = (
  ...permissions: APIS[] | string[]
): boolean => {
  const userPermissions = useUserStore().user.permissions
  if (IsSuperMan(userPermissions)) return true
  let flag = true
  permissions.forEach((permission) => {
    const p = formatPermission(permission)
    if (userPermissions.includes(p)) {
      flag = false
    }
  })
  return flag
}

const IsSuperMan = (userPermissions: string[]) => {
  const all_permission = '*:*:*'
  return userPermissions.includes(all_permission)
}

const formatPermission = (p: string): string => {
  if (p.startsWith('/')) return p.replace('/', '')
  return p
}
