<script lang="ts" setup>
import { Message, Modal, Switch, type TableColumnData, type TableRowSelection } from '@arco-design/web-vue'
import { computed, h, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ErrorFlag } from '@/api/apis'
import { ApiSysRole } from '@/api/sysApis'
import { hasPermission, parseTime, usePut } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import type { dictUse } from '@/types/system/dict'
import type { role } from '@/types/system/role'

defineOptions({ name: 'RoleManageTable' })

withDefaults(defineProps<{
  isLoading: boolean
  dicts: Record<string, dictUse[]>
}>(), {
  isLoading: false,
})

const emits = defineEmits([
  'handleUpdate',
  'handleDataUpdate',
  'handleDelete',
  'handleSelectionChangeFn',
  'getList',
])
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const tableData = defineModel<role[] | null>('tableData', { required: true })

const rowSelection = ref<TableRowSelection>({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
})

// 表格列属性
const columns = computed<TableColumnData[]>(() => [
  {
    title: t('sys.roleName'),
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
    title: t('sys.order'),
    dataIndex: 'list_order',
    align: 'center',
    width: 100,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: t('sys.status'),
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
    title: t('sys.createTime'),
    width: 180,
    align: 'center',
    render: ({ record }) => parseTime(record.created_at),
  },
  {
    title: t('sys.operate'),
    slotName: 'operation',
    width: 250,
    fixed: 'right',
    align: 'center',
  },
])

async function handleStatusChange(row: role) {
  const text = row.status === '1' ? t('app.disable') : t('app.enable')
  const status = row.status === '1' ? '0' : '1'
  const content = `${`${t('sys.confirm2') + text} ${row.role_name}`}?`
  Modal.confirm({
    title: t('sys.roleStatusChange'),
    hideCancel: false,
    titleAlign: 'start',
    content,
    // okText: '确认',
    // cancelText: '取消',
    draggable: true,
    onOk: async () => {
      const { data, execute } = usePut(ApiSysRole.changeStatus, {
        role_id: row.role_id,
        status,
      })
      await execute()
      if (data.value === ErrorFlag)
        return
      Message.success(`${t('sys.youSuccess')} ${text}  ${t('sys.role')} : ${row.role_name}`)
      emits('getList')
    },
    onCancel: () => {
      Message.info(t('sys.tipCancel'))
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
        {{ t('sys.edit') }}
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
        {{ t('sys.delete') }}
        <template #icon>
          <IconDelete />
        </template>
      </a-button>
      <a-button
        v-if="hasPermission(ApiSysRole.setDataScope)"
        type="text"
        shape="round"
        status="warning"
        @click="emits('handleDataUpdate', record)"
      >
        {{ t('sys.dataScope') }}
        <template #icon>
          <IconCheckCircle />
        </template>
      </a-button>
    </template>
  </a-table>
</template>
