<script lang="ts" setup>
import { ref } from 'vue'

import { LoginLogOperator, loginLogQuery, loginLogTable } from './pages/login-log'
import { ApiSysLoginLog } from '@/api/apis'
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
import type { loginLog } from '@/types/system/login-log'
import type { scheduledTasksQueryParam } from '@/types/system/scheduled-tasks'

// 导出名称
defineOptions({
  name: systemMenus.loginLog.path,
})

const showSearch = ref(true)

const dicts = useDicts(dictKey.sysCommonStatus)

const { useTableSelectChange } = useTableUtil()
const { handleSelectionChangeFnX, ids, values, single, selected }
    = useTableSelectChange()

const queryParams = ref<scheduledTasksQueryParam>({
  page_size: 10,
  page_num: 1,
})

const {
  data: dataList,
  execute: getList,
} = useGet<listType<loginLog>>(
  ApiSysLoginLog.getList,
  queryParams,
  { immediate: true },
)

async function handleDelete(row?: loginLog) {
  await useDeleteFn(
    ApiSysLoginLog.delete,
    'info_id',
    ids,
    'info_id',
    values,
    'info_ids',
    row,
    getList,
  )
}
</script>

<template>
  <div>
    <loginLogQuery
      v-model:query-params="queryParams"
      v-model:show-search="showSearch"
      :dicts="dicts"
      @get-list="getList"
    />
    <!-- 操作区域 -->
    <a-row :gutter="10" class="m-b-8px">
      <LoginLogOperator
        :selected="selected"
        :single="single"
        @handle-delete="handleDelete"
        @get-list="getList"
      />
      <RightToolBar v-model:showSearch="showSearch" @query-table="getList" />
    </a-row>
    <!-- 表格区域 -->
    <loginLogTable
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
