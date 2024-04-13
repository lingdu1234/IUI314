<script lang="ts" setup>
import { type PropType, h } from 'vue'
import { useI18n } from 'vue-i18n'
import type { TableColumnData } from '@arco-design/web-vue'
import type { MessageSchema } from '@/i18n'
import DictTag from '@/components/common/dict-tag.vue'
import { dictKey, type dictUse } from '@/types/system/dict'
import { hasPermission, parseTime } from '@/hooks'
import { ApiSysDept } from '@/api/sysApis'
import type { userInformation } from '@/types/system/userInformation'

defineOptions({ name: 'DeptManageTable' })
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
  'handleAdd',
])
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })

const tableData = defineModel<userInformation[] | null>('tableData', { required: true })

// 表格列属性
const columns: TableColumnData[] = [
  {
    title: t('dept.name'),
    dataIndex: 'dept_name',
    width: 300,
  },
  {
    title: '状态',
    width: 100,
    align: 'center',
    render: ({ record }) => h(DictTag, {
      options: props.dicts[dictKey.sysNormalDisable],
      value: record.status,
    }),
  },
  {
    title: '显示排序',
    dataIndex: 'order_num',
    width: 100,
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
    width: 150,
    fixed: 'right',
    align: 'center',
  },
]
</script>

<template>
  <a-skeleton v-if="isLoading" :animation="true">
    <a-space direction="vertical" :style="{ width: '100%' }" size="large">
      <a-skeleton-line :rows="10" />
    </a-space>
  </a-skeleton>
  <a-table
    v-if="tableData && tableData?.length > 0"
    :columns="columns"
    :data="tableData"
    row-key="dept_id"
    :scroll="{ minWidth: 800 }"
    :pagination="false"
    default-expand-all-rows
  >
    <template #operation="{ record }">
      <a-button
        v-if="hasPermission(ApiSysDept.edit)"
        type="text"
        shape="round"
        @click="emits('handleUpdate', record)"
      >
        <template #icon>
          <IconEdit />
        </template>
      </a-button>
      <a-button
        v-if="hasPermission(ApiSysDept.delete) && record.parent_id !== '0'"
        type="text"
        shape="round"
        status="danger"
        @click="emits('handleDelete', record)"
      >
        <template #icon>
          <IconDelete />
        </template>
      </a-button>
      <a-button
        v-if="hasPermission(ApiSysDept.edit)"
        type="text"
        shape="round"
        @click="emits('handleAdd', record)"
      >
        <template #icon>
          <IconPlus />
        </template>
      </a-button>
    </template>
  </a-table>
</template>
