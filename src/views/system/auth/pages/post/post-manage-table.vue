<script lang="ts" setup>
import { type PropType, h, ref } from 'vue'
import type { TableColumnData, TableRowSelection } from '@arco-design/web-vue'
import DictTag from '@/components/common/dict-tag.vue'
import { dictKey, type dictUse } from '@/types/system/dict'
import { hasPermission, parseTime } from '@/hooks'
import { ApiSysPost } from '@/api/sysApis'
import type { userInformation } from '@/types/system/userInformation'

defineOptions({ name: 'PostManageTable' })
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
])

const tableData = defineModel<userInformation[] | null>('tableData', { required: true })

const rowSelection = ref<TableRowSelection>({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
})

// 表格列属性
const columns: TableColumnData[] = [
  {
    title: '岗位编码',
    dataIndex: 'post_code',
    ellipsis: true,
    tooltip: true,
    width: 100,
    align: 'center',
  },
  {
    title: '岗位名称',
    dataIndex: 'post_name',
    align: 'center',
    width: 150,
  },
  {
    title: '岗位排序',
    dataIndex: 'post_sort',
    align: 'center',
    width: 150,
    ellipsis: true,
    tooltip: true,
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

function handleSelectionChange(keys: (string | number)[]) {
  return emits('handleSelectionChangeFn', keys, tableData.value, 'post_id', 'post_name')
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
    row-key="post_id"
    :scroll="{ minWidth: 800 }"
    :pagination="false"
    @selection-change="handleSelectionChange"
  >
    <template #operation="{ record }">
      <a-button
        v-if="hasPermission(ApiSysPost.edit)"
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
        v-if="hasPermission(ApiSysPost.delete)"
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
