import { defineStore } from 'pinia'

import { unref } from 'vue'
import type { dictData, dictUse } from '@/types/system/dict'
import { useGet } from '@/hooks'
import { ApiSysDictData } from '@/api/sysApis'

interface DictsStore {
  dicts: Record<string, dictUse[]>
}

export const useDictsStore = defineStore('dicts', {
  state: (): DictsStore => ({
    dicts: {},
  }),
  actions: {
    async getRemoteDict(dict_type: string) {
      const { data, execute } = useGet<dictData[]>(
        ApiSysDictData.getByType,
        { dict_type },
      )
      await execute()
      const dict_data = unref(data) as dictData[]
      const it_data = dict_data.map(
        (data): dictUse => ({
          label: data.dict_label!,
          value: data.dict_value!,
          elTagType: data.list_class,
          elTagClass: data.css_class,
          status: data.status!,
        }),
      )
      this.dicts[dict_type] = it_data
      return it_data
    },
    async getDict(dict_type: string) {
      const dict = this.dicts[dict_type]
      if (dict)
        return dict
      return await this.getRemoteDict(dict_type)
    },
  },
})
