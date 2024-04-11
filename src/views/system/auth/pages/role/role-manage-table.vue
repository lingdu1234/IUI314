<script lang="ts" setup>
import { type PropType, h, ref } from 'vue'
import { Message, Modal, Switch, type TableColumnData, type TableRowSelection } from '@arco-design/web-vue'
import type { dictUse } from '@/types/system/dict'
import { hasPermission, parseTime, usePut } from '@/hooks'
import { ApiSysRole } from '@/api/sysApis'
import type { role } from '@/types/system/role'
import { ErrorFlag } from '@/api/apis'

defineOptions({ name: 'RoleManageTable' })
const props = defineProps({
  isLoading: {
    type: Boolean,
    required: true,
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
])

const tableData = defineModel<role[] | null>('tableData', { required: true })

const rowSelection = ref<TableRowSelection>({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
})

// 表格列属性
const columns: TableColumnData[] = [
  {
    title: '角色名称',
    dataIndex: 'role_name',
    ellipsis: true,
    tooltip: true,
    width: 150,
    align: 'center',
  },
  {
    title: '权限字符',
    dataIndex: 'role_key',
    align: 'center',
    width: 150,
  },
  {
    title: '显示顺序',
    dataIndex: 'list_order',
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
      disabled: !hasPermission(ApiSysRole.changeStatus),
      checkedValue: '1',
      uncheckedValue: '0',
      modelValue: record.status,
      onChange: () => handleStatusChange(record as role),
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
    width: 250,
    fixed: 'right',
    align: 'center',
  },
]

async function handleStatusChange(row: role) {
  const text = row.status === '1' ? '禁用' : '启用'
  const status = row.status === '1' ? '0' : '1'
  const content = `确认${text}角色:${row.role_name}吗？`
  Modal.confirm({
    title: '角色状态切换',
    hideCancel: false,
    titleAlign: 'start',
    content,
    okText: '确认',
    cancelText: '取消',
    draggable: true,
    onOk: async () => {
      const { data, execute } = usePut(ApiSysRole.changeStatus, {
        role_id: row.role_id,
        status,
      })
      await execute()
      if (data.value === ErrorFlag)
        return
      Message.success(`你成功 ${text} 用户 ${row.role_name}`)
      emits('getList')
    },
    onCancel: () => {
      Message.info('你取消了操作')
      row.status = row.status === '0' ? '1' : '0'
    },
  })
}

function handleSelectionChange(keys: (string | number)[]) {
  return emits('handleSelectionChangeFn', keys, tableData.value, 'role_id', 'role_name')
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
    row-key="role_id"
    :scroll="{ minWidth: 800 }"
    :pagination="false"
    @selection-change="handleSelectionChange"
  >
    <template #operation="{ record }">
      <a-button
        v-if="hasPermission(ApiSysRole.edit)"
        type="text"
        shape="round"
        @click="emits('handleUpdate', record)"
      >
        编辑
        <template #icon>
          <IconEdit />
        </template>
      </a-button>
      <a-button
        v-if="hasPermission(ApiSysRole.delete)"
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
      <a-button
        v-if="hasPermission(ApiSysRole.setDataScope)"
        type="text"
        shape="round"
        status="warning"
        @click="emits('handleDelete', record)"
      >
        权限
        <template #icon>
          <IconCheckCircle />
        </template>
      </a-button>
    </template>
  </a-table>
</template>
