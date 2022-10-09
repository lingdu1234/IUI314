/* eslint-disable no-unused-vars */
/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-07 17:16:45
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-09 14:53:11
 * @FilePath: \IUI314\src\api\system\dict.ts
 * @Description:
 */

import { SysDictApi } from '@/api/apis'
import { useGet } from '@/hooks'
import type { dictByType, DictData } from '@/types/system/dict'

/**
 * @description 按类型获取字典数据
 * @param {dictByType} dictType
 * @return {DictData[]}
 */
export const getDictDataByType = async (
  dictType: dictByType
): Promise<DictData[]> => {
  const { data, execute } = useGet<DictData[]>(
    SysDictApi.getDictDataByType,
    dictType
  )
  await execute()
  return data.value!
}
