/* eslint-disable no-unused-vars */
/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-07 17:16:45
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\api\system\dict.ts
 * @Description:
 */

import { ApiSysDictData } from '@/api/apis'
import { useGet } from '@/hooks'
import type { dictByType, dictData } from '@/types/system/dict'

/**
 * @description 按类型获取字典数据
 * @param {dictByType} dictType
 * @return {dictData[]}
 */
export const getDictDataByType = async (
  dictType: dictByType
): Promise<dictData[]> => {
  const { data, execute } = useGet<dictData[]>(
    ApiSysDictData.getByType,
    dictType
  )
  await execute()
  return data.value!
}
