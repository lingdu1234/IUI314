/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-12 08:24:42
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-14 17:56:32
 * @FilePath: \IUI314\src\hooks\util\useList.ts
 * @Description:
 */

import { ElMessage, ElMessageBox } from 'element-plus'
import { type Ref, ref } from 'vue'

import type { APIS } from '@/api/apis'
import type { operateInfo, pageData, pageQueryParam } from '@/types/base/apis'

import { useDelete, useGet } from './useRequest'
import { addTimeQueryParam } from './useUtils'

export interface listType<V extends operateInfo> extends pageData {
  list: V[]
}

/**
 * 列表数据相关数据;
 * Q为查询参数泛型;
 * V返回结果泛型;
 * @param queryParam 请求参数
 */
export const useListData = <Q extends pageQueryParam, V extends operateInfo>(
  api: APIS,
  queryParam: Ref<Q>,
  time?: Ref<string[]>
) => {
  const list = ref<V[]>([]) as Ref<V[]>
  const total = ref(0)
  /**
   * 获取数据列表
   */
  const getListFn = async () => {
    if (time) {
      queryParam.value = addTimeQueryParam(queryParam.value, time?.value)
    }
    const { data, execute } = useGet<listType<V>>(api, queryParam)
    await execute()
    list.value = data.value?.list!
    total.value = data.value?.total!
  }
  getListFn()
  return {
    getListFn,
    list,
    total,
  }
}

export const useDeleteFn = async (
  api: APIS,
  idsKey: string,
  ids: Ref<string[]>,
  valuesKey: string,
  values: Ref<any[]>,
  deleteKey: string,
  row?: { [key: string]: any }
): Promise<boolean> => {
  let flag = false
  const _ids = row?.[idsKey] ? [row?.[idsKey]] : ids.value
  const names = row?.[valuesKey] ? row?.[valuesKey] : values.value
  await ElMessageBox.confirm(`你是否确定删除数据:${names}`, '删除确认', {
    type: 'warning',
  })
    .then(async () => {
      const query = ref<{ [key: string]: any }>({})
      query.value[deleteKey] = _ids
      const { execute } = useDelete(api, query)
      await execute()
      ElMessage.success('删除成功')
      flag = true
    })
    .catch(() => {
      ElMessage.info('取消删除')
    })
  return flag
}
