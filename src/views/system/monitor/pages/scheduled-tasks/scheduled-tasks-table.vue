<script lang="ts" setup>
import { type PropType, h, ref } from 'vue'
import { Message, Modal, Switch, type TableColumnData, type TableRowSelection } from '@arco-design/web-vue'
import DictTag from '@/components/common/dict-tag.vue'
import { dictKey, type dictUse } from '@/types/system/dict'
import { hasPermission, parseTime, usePut } from '@/hooks'
import { ApiSysScheduledTasks, ApiSysScheduledTasksLog } from '@/api/sysApis'
import type { scheduledTasks } from '@/types/system/scheduled-tasks'
import { ErrorFlag } from '@/api/apis'
import { ScheduledTasksLogRouteName, router } from '@/router'

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
  'handleUpdate',
  'handleDelete',
  'handleSelectionChangeFn',
  'getList',
  'handleOpenDetail',
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
    title: '任务ID',
    dataIndex: 'task_id',
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
    title: 'invokeFunction',
    dataIndex: 'invoke_target',
    align: 'center',
    width: 150,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: 'CRON',
    dataIndex: 'cron_expression',
    align: 'center',
    width: 150,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '下次执行',
    align: 'center',
    width: 180,
    ellipsis: true,
    tooltip: true,
    render({ record }) {
      return record.status === '0'
        ? h('span', { style: { color: 'red' } }, '未运行')
        : h('span', { style: { color: 'green' } }, parseTime(record.next_time))
    },
  },
  {
    title: '批次数',
    align: 'center',
    width: 150,
    ellipsis: true,
    tooltip: true,
    render({ record }) {
      return record.task_count === 0
        ? h('span', null, '无限次')
        : h('span', null, record.task_count)
    },
  },
  {
    title: '已执行',
    dataIndex: 'run_count',
    align: 'center',
    width: 100,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '状态',
    width: 100,
    align: 'center',
    render: ({ record }) => h(Switch, {
      disabled: !hasPermission(ApiSysScheduledTasks.changeStatus),
      checkedValue: '1',
      uncheckedValue: '0',
      modelValue: record.status,
      onChange: () => handleStatusChange(record as scheduledTasks),
    }),
  },
  {
    title: '创建时间',
    width: 180,
    align: 'center',
    render: ({ record }) => parseTime(record.created_at),
  },
  {
    title: '操作',
    slotName: 'operation',
    width: 200,
    fixed: 'right',
    align: 'center',
  },
]

async function handleStatusChange(row: scheduledTasks) {
  const text = row.status === '1' ? '禁用' : '启用'
  const status = row.status === '1' ? '0' : '1'
  const content = `确认${text}任务:${row.job_name}吗？`
  Modal.confirm({
    title: '任务状态切换',
    hideCancel: false,
    titleAlign: 'start',
    content,
    okText: '确认',
    cancelText: '取消',
    draggable: true,
    onOk: async () => {
      const { data, execute } = usePut(ApiSysScheduledTasks.changeStatus, {
        job_id: row.job_id,
        status,
      })
      await execute()
      if (data.value === ErrorFlag)
        return
      Message.success(`你成功 ${text} 任务 ${row.job_name}`)
      emits('getList')
    },
    onCancel: () => {
      Message.info('你取消了操作')
      row.status = row.status === '0' ? '1' : '0'
    },
  })
}

async function handleRunOnce(row: scheduledTasks) {
  const content = `确认执行任务:${row.job_name}一次吗？`
  Modal.confirm({
    title: '任务单次执行',
    hideCancel: false,
    titleAlign: 'start',
    content,
    okText: '确认',
    cancelText: '取消',
    draggable: true,
    onOk: async () => {
      const { data, execute } = usePut(ApiSysScheduledTasks.runOnce, {
        job_id: row.job_id,
        task_id: row.task_id,
      })
      await execute()
      if (data.value === ErrorFlag)
        return
      Message.success(`你成功执行任务 ${row.job_name}一次`)
      emits('getList')
    },
    onCancel: () => {
      Message.info('你取消了单次执行任务')
    },
  })
}

function handleSelectionChange(keys: (string | number)[]) {
  return emits('handleSelectionChangeFn', keys, tableData.value, 'job_id', 'job_name')
}
function go_to_log(row?: scheduledTasks) {
  const job_id = row?.job_id || 'all'
  router.push({
    name: ScheduledTasksLogRouteName,
    query: { job_id },
  })
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
    row-key="job_id"
    :scroll="{ minWidth: 800 }"
    :pagination="false"
    @selection-change="handleSelectionChange"
  >
    <template #operation="{ record }">
      <a-tooltip
        v-if="hasPermission(ApiSysScheduledTasks.edit)"
        content="编辑"
      >
        <a-button
          type="text"
          shape="circle"
          @click="emits('handleUpdate', record)"
        >
          <template #icon>
            <IconEdit />
          </template>
        </a-button>
      </a-tooltip>
      <a-tooltip
        v-if="hasPermission(ApiSysScheduledTasks.delete)"
        content="删除"
      >
        <a-button
          type="text"
          shape="circle"
          status="danger"
          @click="emits('handleDelete', record)"
        >
          <template #icon>
            <IconDelete />
          </template>
        </a-button>
      </a-tooltip>

      <a-tooltip
        v-if="hasPermission(ApiSysScheduledTasks.runOnce)"
        content="单次运行任务"
      >
        <a-button
          type="text"
          shape="circle"
          status="warning"
          @click="handleRunOnce(record)"
        >
          <template #icon>
            <IconRightCircle />
          </template>
        </a-button>
      </a-tooltip>

      <a-tooltip
        v-if="hasPermission(ApiSysScheduledTasks.getById)"
        content="查看任务详情"
      >
        <a-button
          type="text"
          shape="circle"
          status="success"
          @click="emits('handleOpenDetail', record)"
        >
          <template #icon>
            <IconInfoCircle />
          </template>
        </a-button>
      </a-tooltip>

      <a-tooltip
        v-if="hasPermission(ApiSysScheduledTasksLog.getList)"
        content="查看任务详情"
      >
        <a-button
          type="text"
          shape="circle"
          @click="go_to_log(record)"
        >
          <template #icon>
            <IconSchedule />
          </template>
        </a-button>
      </a-tooltip>
    </template>
  </a-table>
</template>
