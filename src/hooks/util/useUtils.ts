import { useAppStore } from '@/stores'

/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-05 19:56:52
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-06 12:49:08
 * @FilePath: \IUI314\src\hooks\util\useUtils.ts
 * @Description:
 */
const opt = Object.prototype.toString

export function isString(obj: any): obj is string {
  return opt.call(obj) === '[object String]'
}

// 标图设置
export const useDynamicTitle = () => {
  const appStore = useAppStore()
  if (appStore.app.dynamicTitle) {
    window.document.title = appStore.app.title + '-' + appStore.app.name
  } else {
    window.document.title = appStore.app.name
  }
}
