/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-01 08:30:41
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-03 22:55:04
 * @FilePath: \IUI314\src\hooks\routes\useRouteUtl.ts
 * @Description: route utils
 */
export const getNormalPath = (path: string): string => {
  if (path.length === 0 || !path || path == 'undefined') {
    return path
  }
  const res = path.replace('//', '/')
  if (res[res.length - 1] === '/') {
    return res.slice(0, res.length - 1)
  }
  return res
}

export const isExternal = (path: string): Boolean => {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function isHttp(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://')
}
