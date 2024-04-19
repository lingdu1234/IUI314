<script lang="ts" setup>
import { type PropType, h, ref } from 'vue'
import type { TableColumnData, TableRowSelection } from '@arco-design/web-vue'
import DictTag from '@/components/common/dict-tag.vue'
import { dictKey, type dictUse } from '@/types/system/dict'
import { hasPermission, parseTime } from '@/hooks'
import { ApiSysScheduledTasksLog } from '@/api/sysApis'
import type { scheduledTasks } from '@/types/system/scheduled-tasks'

defineOptions({ name: 'ScheduledLogTable' })
const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
  dicts: {
    type: Object as PropType<Record<string, dictUse[]>>,
    required: true,
  },
})

const emits = defineEmits([
  'handleDelete',
  'handleSelectionChangeFn',
  'getList',
])

const tableData = defineModel<scheduledTasks[] | null>('tableData', { required: true })

const rowSelection = ref<TableRowSelection>({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
})

// 表格列属性
const columns: TableColumnData[] = [
  {
    title: '日志编号',
    dataIndex: 'job_log_id',
    ellipsis: true,
    tooltip: true,
    width: 100,
    align: 'center',
  },
  {
    title: '任务名称',
    dataIndex: 'job_name',
    align: 'center',
    width: 150,
  },
  {
    title: '任务组名',
    width: 100,
    align: 'center',
    render: ({ record }) => h(DictTag, {
      options: props.dicts[dictKey.sysJobGroup],
      value: record.job_group,
    }),
  },
  {
    title: '批ID',
    dataIndex: 'lot_id',
    align: 'center',
    width: 150,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '批内序',
    dataIndex: 'lot_order',
    align: 'center',
    width: 100,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '方法',
    dataIndex: 'invoke_target',
    align: 'center',
    width: 150,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '执行状态',
    width: 100,
    align: 'center',
    render: ({ record }) => h(DictTag, {
      options: props.dicts[dictKey.sysCommonStatus],
      value: record.status,
    }),
  },
  {
    title: '任务属性',
    width: 100,
    align: 'center',
    render: ({ record }) => h(DictTag, {
      options: props.dicts[dictKey.sysTaskIsOnce],
      value: record.is_once,
    }),
  },
  {
    title: '执行时间',
    width: 180,
    align: 'center',
    render: ({ record }) => parseTime(record.created_at),
  },
  {
    title: '操作',
    slotName: 'operation',
    width: 100,
    fixed: 'right',
    align: 'center',
  },
]

function handleSelectionChange(keys: (string | number)[]) {
  return emits('handleSelectionChangeFn', keys, tableData.value, 'job_log_id', 'job_log_id')
}
</script>

<template>
  <a-skeleton v-if="isLoading" :animation="true">
    <a-space direction="vertical" :style="{ width: '100%' }" size="large">
      <a-skeleton-line :rows="10" />
    </a-space>
  </a-skeleton>
  <a-table
    v-else
    :columns="columns"
    :data="tableData || []"
    :row-selection="rowSelection"
    row-key="job_log_id"
    :scroll="{ minWidth: 800 }"
    :pagination="false"
    @selection-change="handleSelectionChange"
  >
    <template #operation="{ record }">
      <a-button
        v-if="hasPermission(ApiSysScheduledTasksLog.delete)"
        type="text"
        shape="circle"
        status="danger"
        @click="emits('handleDelete', record)"
      >
        删除
        <template #icon>
          <IconDelete />
        </template>
      </a-button>
    </template>
  </a-table>
</template>
