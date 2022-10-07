/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-01 14:50:08
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-07 19:40:53
 * @FilePath: \IUI314\src\stores\modules\dicts.ts
 * @Description: appStore
 */
import { defineStore } from 'pinia'

import { getDictDataByType } from '@/api/system/dict'
import type { DictUse } from '@/types/system/dict'

// interface DictsStore {
//   dicts: Map<string, DictUse[]>
// }

export const useDictsStore = defineStore('dicts', {
  state: () => ({
    dicts: {},
  }),
  persist: {
    paths: ['dicts'],
  },
  actions: {
    async getRemoteDict(dict_type: string) {
      const dict_data = await getDictDataByType({ dict_type: dict_type })
      const it_data = dict_data.map(
        (data): DictUse => ({
          label: data.dict_label,
          value: data.dict_value,
          elTagType: data.list_class,
          status: data.status,
        })
      )
      this.dicts[dict_type] =  it_data
      return it_data
    },
    async getDict(dict_type: string) {
      const dict = this.dicts[dict_type]
      if (dict) return dict
      return await this.getRemoteDict(dict_type)
    },
  },
})
