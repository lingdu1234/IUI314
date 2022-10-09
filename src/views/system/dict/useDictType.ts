/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-09 14:38:34
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-09 17:21:30
 * @FilePath: \IUI314\src\views\system\dict\useDictType.ts
 * @Description:
 */
import { type Ref, ref } from 'vue'

import { SysDictApi } from '@/api/apis'
import { useGet } from '@/hooks'
import type {
  dictType,
  dictTypeList,
  dictTypeQueryParam,
} from '@/types/system/dict'

/**
 *字典类型相关数据
 * @param querParam 请求参数
 */
export const getDictTypeList = (querParam: Ref<dictTypeQueryParam>) => {
  const dictTypeList = ref<dictType[]>([])
  const total = ref(0)
  /**
   * 获取字典类型列表
   */
  const getDictTypeListFn = async () => {
    const { data, execute } = useGet<dictTypeList>(
      SysDictApi.getDictTypeList,
      querParam
    )
    await execute()
    dictTypeList.value = data.value?.list!
    total.value = data.value?.total!
  }
  getDictTypeListFn()
  return {
    getDictTypeListFn,
    dictTypeList,
    total,
  }
}
