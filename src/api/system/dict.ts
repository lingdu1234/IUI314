/* eslint-disable no-unused-vars */
/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-07 17:16:45
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-07 17:58:06
 * @FilePath: \IUI314\src\api\system\dict.ts
 * @Description:
 */

import { useGet } from '@/hooks'
import type { dictByType, DictData } from '@/types/system/dict'

/**
 * @description: Api
 */
enum Api {
  getDictDataByType = '/system/dict/data/get_by_type',
}

/**
 * @description:
 * @param {dictByType} dictType
 * @return {DictData[]}
 */
export const getDictDataByType = async (
  dictType: dictByType
): Promise<DictData[]> => {
  const { data, execute } = useGet<DictData[]>(Api.getDictDataByType, dictType)
  await execute()
  return data.value!
}
