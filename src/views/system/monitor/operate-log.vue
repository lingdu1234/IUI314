<script lang="ts" setup>
import { ref } from 'vue'

import { OperateLogOperator, OperateLogQuery, OperateLogTable } from './pages/operate-log'

import { ApiSysLoginLog, ApiSysOperateLog } from '@/api/apis'
import Pagination from '@/components/common/pagination.vue'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import {
  type listType,
  useDeleteFn,
  useDicts,
  useGet,
  useTableUtil,
} from '@/hooks'
import { systemMenus } from '@/router'
import { dictKey } from '@/types/system/dict'
import type { operateLog, operateLogQueryParam } from '@/types/system/operate-log'

// 导出名称
defineOptions({
  name: systemMenus.operateLog.path,
})

const showSearch = ref(true)

const dicts = useDicts(
  dictKey.sysCommonStatus,
  dictKey.sysApiMethod,
  dictKey.sysOperType,
)

const { useTableSelectChange } = useTableUtil()
const { handleSelectionChangeFnX, ids, values, single, selected }
    = useTableSelectChange()

const queryParams = ref<operateLogQueryParam>({
  page_size: 10,
  page_num: 1,
})

const {
  data: dataList,
  execute: getList,
} = useGet<listType<operateLog>>(
  ApiSysOperateLog.getList,
  queryParams,
  { immediate: true },
)

async function handleDelete(row?: operateLog) {
  await useDeleteFn(
    ApiSysLoginLog.delete,
    'oper_id',
    ids,
    'title',
    values,
    'oper_ids',
    row,
    getList,
  )
}
</script>

<template>
  <div>
    <OperateLogQuery
      v-model:query-params="queryParams"
      v-model:show-search="showSearch"
      :dicts="dicts"
      @get-list="getList"
    />
    <!-- 操作区域 -->
    <a-row :gutter="10" class="m-b-8px">
      <OperateLogOperator
        :selected="selected"
        :single="single"
        @handle-delete="handleDelete"
        @get-list="getList"
      />
      <RightToolBar v-model:showSearch="showSearch" @query-table="getList" />
    </a-row>
    <!-- 表格区域 -->
    <OperateLogTable
      :dicts="dicts"
      :table-data="dataList && dataList?.list"
      @handle-delete="handleDelete"
      @handle-selection-change-fn="handleSelectionChangeFnX"
      @get-list="getList"
    />
    <Pagination
      v-show="dataList?.total && dataList.total > 0"
      v-model:limit="queryParams.page_size"
      v-model:page="queryParams.page_num"
      :total="dataList?.total"
      @pagination="getList"
    />
  </div>
</template>
