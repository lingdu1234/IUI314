import { ref } from 'vue'

import { getDictDataByType } from '@/api/system/dict'
import { useAppStore } from '@/stores'
import type { DictUse } from '@/types/system/dict'

/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-05 19:56:52
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-07 19:07:04
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

// 获取字典数据
export const useDicts = async (...dictTypes: string[]) => {
  let key = typeof dictTypes
  const result = ref<Record<string, DictUse[]>>()
  for (const dict_type of dictTypes) {
    const dict_data = await getDictDataByType({ dict_type: dict_type })
    const it_data = dict_data.map(
      (data): DictUse => ({
        label: data.dict_label,
        value: data.dict_value,
        elTagType: data.list_class,
        status: data.status,
      })
    )
    // result.value?[] = it_data
  }
  return result
}
