<script lang="ts" setup>
import type { TableColumnData, TableRowSelection } from '@arco-design/web-vue'
import { type PropType, computed, h, ref } from 'vue'
import OperateLogDetail from './operate-log-detail.vue'
import { ApiSysOperateLog } from '@/api/sysApis'
import DictTag from '@/components/common/dict-tag.vue'
import { hasPermission, parseTime } from '@/hooks'
import { dictKey, type dictUse } from '@/types/system/dict'
import type { operateLog } from '@/types/system/operate-log'

defineOptions({ name: 'OperateLogTable' })
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

const modalRef = ref<InstanceType<typeof OperateLogDetail>>()

const tableData = defineModel<operateLog[] | null>('tableData', { required: true })

const rowSelection = ref<TableRowSelection>({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
})

// 表格列属性
const columns = computed<TableColumnData[]>(() => [
  {
    title: '日志编号',
    dataIndex: 'oper_id',
    ellipsis: true,
    tooltip: true,
    width: 100,
    align: 'center',
  },
  {
    title: '系统模块',
    dataIndex: 'title',
    ellipsis: true,
    tooltip: true,
    align: 'center',
    width: 150,
  },
  {
    title: '操作类型',
    align: 'center',
    width: 100,
    render: ({ record }) => h(DictTag, {
      options: props.dicts[dictKey.sysOperType],
      value: record.operator_type,
    }),
  },
  {
    title: '请求方式',
    align: 'center',
    width: 100,
    render: ({ record }) => h(DictTag, {
      options: props.dicts[dictKey.sysApiMethod],
      value: record.request_method,
    }),
  },
  {
    title: '操作人员',
    dataIndex: 'oper_name',
    align: 'center',
    width: 120,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '地址',
    dataIndex: 'oper_location',
    ellipsis: true,
    tooltip: true,
    width: 180,
    align: 'center',
  },
  {
    title: '操作状态',
    align: 'center',
    width: 100,
    render: ({ record }) => h(DictTag, {
      options: props.dicts[dictKey.sysCommonStatus],
      value: record.status,
    }),
  },
  {
    title: '耗时(μs)',
    dataIndex: 'duration',
    width: 180,
    align: 'center',
  },
  {
    title: '操作时间',
    width: 180,
    align: 'center',
    render: ({ record }) => parseTime(record.oper_time),
  },
  {
    title: '操作',
    slotName: 'operation',
    width: 100,
    fixed: 'right',
    align: 'center',
  },
])

function handleSelectionChange(keys: (string | number)[]) {
  return emits('handleSelectionChangeFn', keys, tableData.value, 'oper_id', 'title')
}

function handleView(row: operateLog) {
  modalRef.value?.openDetail(row)
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
    row-key="oper_id"
    :scroll="{ minWidth: 800 }"
    :pagination="false"
    @selection-change="handleSelectionChange"
  >
    <template #operation="{ record }">
      <a-button
        v-if="hasPermission(ApiSysOperateLog.delete)"
        type="text"
        shape="round"
        status="normal"
        @click="handleView(record)"
      >
        查看
        <template #icon>
          <IconEye />
        </template>
      </a-button>
    </template>
  </a-table>
  <OperateLogDetail
    ref="modalRef"
    :dicts="dicts"
  />
</template>
