/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-05 19:56:52
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-10 17:44:54
 * @FilePath: \IUI314\src\hooks\util\useUtils.ts
 * @Description:
 */
import { useDateFormat } from '@vueuse/core'
import { ref } from 'vue'

import { useAppStore, useDictsStore } from '@/stores'
import type { pageQueryParam } from '@/types/base/apis'
import type { dictUse } from '@/types/system/dict'

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
  const result = ref<Record<string, dictUse[]>>({})
  for (const dictType of dictTypes) {
    useDictsStore()
      .getDict(dictType)
      .then((data: dictUse[]) => {
        result.value[dictType] = data
      })
  }
  return result
}

/**
 *  解析时间
 * @param time 时间
 * @param format
 * @returns
 */
export const parseTime = (time: any, format?: string) => {
  if (!format) {
    format = 'YYYY-MM-DD HH:mm:ss'
  }
  const formatted = useDateFormat(time, 'YYYY-MM-DD HH:mm:ss')
  return formatted.value
}

export const addTimeQueryParam = <T extends pageQueryParam>(
  queryParams: T,
  time: string[]
) => {
  const res = {
    ...queryParams,
  }
  res.begin_time = time[0]
  res.end_time = time[1]
  return res
}
