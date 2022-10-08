/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-05 19:56:52
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-08 16:42:31
 * @FilePath: \IUI314\src\hooks\util\useUtils.ts
 * @Description:
 */
import { ref } from 'vue'

import { useAppStore, useDictsStore } from '@/stores'
import type { DictUse } from '@/types/system/dict'

const opt = Object.prototype.toString

export function isString(obj: any): obj is string {
  return opt.call(obj) === '[object String]'
}

/**
 * 动态标题
 */
export const useDynamicTitle = () => {
  const appStore = useAppStore()
  if (appStore.app.dynamicTitle) {
    window.document.title = appStore.app.title + '-' + appStore.app.name
  } else {
    window.document.title = appStore.app.name
  }
}

/**
 * 获取字典数据
 * @param dictTypes
 */
export const useDicts = (...dictTypes: string[]) => {
  const result = ref<Record<string, DictUse[]>>({})
  for (const dictType of dictTypes) {
    useDictsStore()
      .getDict(dictType)
      .then((data) => {
        result.value[dictType] = data
      })
  }
  return result
}
