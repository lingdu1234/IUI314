<script lang="ts" setup>
import { ref } from 'vue'

import { ApiSysScheduledTasks } from '@/api/apis'
import Pagination from '@/components/common/pagination.vue'
import {
  type listType,
  useDeleteFn,
  useDicts,
  useGet,
  useTableUtil,
} from '@/hooks'
import { dictKey } from '@/types/system/dict'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import { systemMenus } from '@/router'
import type { scheduledTasks, scheduledTasksQueryParam } from '@/types/system/scheduled-tasks'
import {
  ScheduledTasksDetail,
  ScheduledTasksModal,
  ScheduledTasksOperator,
  ScheduledTasksQuery,
  ScheduledTasksTable,
} from '@/views/system/monitor/pages/scheduled-tasks'

// 导出名称
defineOptions({
  name: systemMenus.scheduledTasks.path,
})

const showSearch = ref(true)

const modalRef = ref<InstanceType<typeof ScheduledTasksModal>>()
const detailRef = ref<InstanceType<typeof ScheduledTasksDetail>>()

const dicts = useDicts(
  dictKey.sysNormalDisable,
  dictKey.sysJobGroup,
)

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
} = useGet<listType<scheduledTasks>>(
  ApiSysScheduledTasks.getList,
  queryParams,
  { immediate: true },
)

const openDetail = (row: scheduledTasks) => detailRef.value?.openDetail(row)
const handAdd = () => modalRef.value?.handleAdd()
const handleUpdate = (row?: scheduledTasks) => modalRef.value?.handleUpdate(row)

async function handleDelete(row?: scheduledTasks) {
  await useDeleteFn(
    ApiSysScheduledTasks.delete,
    'job_id',
    ids,
    'job_name',
    values,
    'job_ids',
    row,
    getList,
  )
}
</script>

<template>
  <div>
    <ScheduledTasksQuery
      v-model:query-params="queryParams"
      v-model:show-search="showSearch"
      :dicts="dicts"
      @get-list="getList"
    />
    <!-- 操作区域 -->
    <a-row :gutter="10" class="m-b-8px">
      <ScheduledTasksOperator
        :selected="selected"
        :single="single"
        @handle-delete="handleDelete"
        @handle-update="handleUpdate"
        @hand-add="handAdd"
        @get-list="getList"
      />
      <RightToolBar v-model:showSearch="showSearch" @query-table="getList" />
    </a-row>
    <!-- 表格区域 -->
    <ScheduledTasksTable
      :dicts="dicts"
      :table-data="dataList && dataList?.list"
      @handle-delete="handleDelete"
      @handle-update="handleUpdate"
      @handle-open-detail="openDetail"
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
    <ScheduledTasksModal
      ref="modalRef"
      :ids="ids"
      :dicts="dicts"
      @get-list="getList"
    />
    <ScheduledTasksDetail
      ref="detailRef"
      :ids="ids"
      :dicts="dicts"
      @get-list="getList"
    />
  </div>
</template>
