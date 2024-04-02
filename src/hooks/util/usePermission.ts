import type { APIS } from '@/api/apis'
import { useUserStore } from '@/stores'

/** 具有一个权限就返回True */
export function hasPermission(...permissions: APIS[] | string[]): boolean {
  const userPermissions = useUserStore().user.permissions
  if (IsSuperMan(userPermissions))
    return true
  let flag = false
  permissions.forEach((permission) => {
    const p = formatPermission(permission)
    if (userPermissions.includes(p))
      flag = true
  })
  return flag
}
/** 具有所有权限才返回True */
export function hasPermissionALL(...permissions: APIS[] | string[]): boolean {
  const userPermissions = useUserStore().user.permissions
  if (IsSuperMan(userPermissions))
    return true
  let flag = true
  permissions.forEach((permission) => {
    const p = formatPermission(permission)
    if (userPermissions.includes(p))
      flag = false
  })
  return flag
}

function IsSuperMan(userPermissions: string[]) {
  const all_permission = '*:*:*'
  return userPermissions.includes(all_permission)
}

function formatPermission(p: string): string {
  if (p.startsWith('/'))
    return p.replace('/', '')
  return p
}
