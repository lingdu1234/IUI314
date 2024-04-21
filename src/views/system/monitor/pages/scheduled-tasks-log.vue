<script lang="ts" setup>
import { ref } from 'vue'

import { Message, Modal } from '@arco-design/web-vue'
import { useRoute } from 'vue-router'
import { ApiSysScheduledTasksLog } from '@/api/apis'
import Pagination from '@/components/common/pagination.vue'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import {
  type listType,
  useDelete,
  useDeleteFn,
  useDicts,
  useGet,
  useTableUtil,
} from '@/hooks'
import { systemMenus } from '@/router'
import { dictKey } from '@/types/system/dict'
import type {
  scheduledTasks,
  scheduledTasksLogQueryParam,
} from '@/types/system/scheduled-tasks'
import { ScheduledLogOperator, ScheduledLogQuery, ScheduledLogTable } from '@/views/system/monitor/pages/scheduled-log'

// 导出名称
defineOptions({
  name: systemMenus.scheduledTasks.path,
})

const showSearch = ref(true)
const route = useRoute()

const dicts = useDicts(
  dictKey.sysTaskIsOnce,
  dictKey.sysCommonStatus,
  dictKey.sysJobGroup,
)

const { useTableSelectChange } = useTableUtil()
const { handleSelectionChangeFnX, ids, values, single, selected }
    = useTableSelectChange()

const queryParams = ref<scheduledTasksLogQueryParam>({
  page_size: 10,
  page_num: 1,
  job_id: route.query.job_id as string,
})

const {
  data: dataList,
  execute: getList,
} = useGet<listType<scheduledTasks>>(
  ApiSysScheduledTasksLog.getList,
  queryParams,
  { immediate: true },
)

function handleClean() {
  const job_id = queryParams.value.job_id
  if (job_id === 'all' || job_id === undefined)
    return Message.info('当前选择为ALL,无法清除')
  Modal.warning({
    title: '确认清空',
    hideCancel: false,
    titleAlign: 'start',
    content: '是否确认清空当前任务所有日志?',
    okText: '确认',
    cancelText: '取消',
    draggable: true,
    onOk: async () => {
      const { execute } = useDelete(ApiSysScheduledTasksLog.clean, { job_id })
      await execute()
      Message.success('清空当前任务日志成功')
      await getList()
    },
    onCancel: async () => Message.info('取消清空操作'),
  })
}

async function handleDelete(row?: scheduledTasks) {
  await useDeleteFn(
    ApiSysScheduledTasksLog.delete,
    'job_log_id',
    ids,
    'job_log_id',
    values,
    'job_log_ids',
    row,
    getList,
  )
}
</script>

<template>
  <div>
    <ScheduledLogQuery
      v-model:query-params="queryParams"
      v-model:show-search="showSearch"
      :dicts="dicts"
      @get-list="getList"
    />
    <!-- 操作区域 -->
    <a-row :gutter="10" class="m-b-8px">
      <ScheduledLogOperator
        :selected="selected"
        :single="single"
        @handle-delete="handleDelete"
        @handle-clean="handleClean"
        @get-list="getList"
      />
      <RightToolBar v-model:showSearch="showSearch" @query-table="getList" />
    </a-row>
    <!-- 表格区域 -->
    <ScheduledLogTable
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
