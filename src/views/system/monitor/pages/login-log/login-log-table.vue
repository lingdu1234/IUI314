<script lang="ts" setup>
import type { TableColumnData, TableRowSelection } from '@arco-design/web-vue'
import { type PropType, h, ref } from 'vue'
import { ApiSysLoginLog } from '@/api/apis'
import DictTag from '@/components/common/dict-tag.vue'
import { hasPermission, parseTime } from '@/hooks'
import { dictKey, type dictUse } from '@/types/system/dict'
import type { loginLog } from '@/types/system/login-log'

defineOptions({ name: 'LoginLogTable' })
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

const tableData = defineModel<loginLog[] | null>('tableData', { required: true })

const rowSelection = ref<TableRowSelection>({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
})

// 表格列属性
const columns: TableColumnData[] = [
  {
    title: '访问编号',
    dataIndex: 'info_id',
    ellipsis: true,
    tooltip: true,
    width: 100,
    align: 'center',
  },
  {
    title: '用户名称',
    dataIndex: 'login_name',
    align: 'center',
    width: 100,
  },
  {
    title: '网络',
    dataIndex: 'net',
    align: 'center',
    width: 100,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '地址',
    dataIndex: 'ipaddr',
    align: 'center',
    width: 120,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '登录地点',
    dataIndex: 'login_location',
    ellipsis: true,
    tooltip: true,
    width: 180,
    align: 'center',
  },
  {
    title: '操作系统',
    dataIndex: 'os',
    width: 180,
    align: 'center',
  },
  {
    title: '浏览器',
    dataIndex: 'browser',
    ellipsis: true,
    tooltip: true,
    width: 120,
    align: 'center',
  },
  {
    title: '设备',
    dataIndex: 'device',
    width: 120,
    ellipsis: true,
    tooltip: true,
    align: 'center',
  },
  {
    title: '登录状态',
    width: 100,
    align: 'center',
    render: ({ record }) => h(DictTag, {
      options: props.dicts[dictKey.sysCommonStatus],
      value: record.status,
    }),
  },
  {
    title: '访问时间',
    width: 180,
    align: 'center',
    render: ({ record }) => parseTime(record.login_time),
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
  return emits('handleSelectionChangeFn', keys, tableData.value, 'info_id', 'info_id')
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
    row-key="info_id"
    :scroll="{ minWidth: 800 }"
    :pagination="false"
    @selection-change="handleSelectionChange"
  >
    <template #operation="{ record }">
      <a-button
        v-if="hasPermission(ApiSysLoginLog.delete)"
        type="text"
        shape="round"
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
