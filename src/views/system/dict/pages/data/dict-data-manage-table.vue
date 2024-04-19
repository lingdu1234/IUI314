<script lang="ts" setup>
import { type PropType, h, ref } from 'vue'
import type { TableColumnData, TableRowSelection } from '@arco-design/web-vue'
import { dictKey, type dictUse } from '@/types/system/dict'
import { hasPermission, parseTime } from '@/hooks'
import { ApiSysPost } from '@/api/sysApis'
import type { userInformation } from '@/types/system/userInformation'
import DictTag from '@/components/common/dict-tag.vue'

defineOptions({ name: 'DictDataManageTable' })
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
    title: '字典编码',
    dataIndex: 'dict_data_id',
    ellipsis: true,
    tooltip: true,
    width: 200,
    align: 'center',
  },
  {
    title: '字典标签',
    slotName: 'dictLabel',
    width: 100,
    align: 'center',
  },
  {
    title: '字典键值',
    dataIndex: 'dict_value',
    width: 100,
    align: 'center',
  },
  {
    title: '字典排序',
    dataIndex: 'dict_sort',
    width: 100,
    align: 'center',
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
    title: '备注',
    dataIndex: 'remark',
    width: 100,
    align: 'center',
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
    // fixed: 'right',
    align: 'center',
  },
]

function handleSelectionChange(keys: (string | number)[]) {
  return emits('handleSelectionChangeFn', keys, tableData.value, 'dict_data_id', 'dict_label')
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
    row-key="dict_data_id"
    :scroll="{ minWidth: 800 }"
    :pagination="false"
    @selection-change="handleSelectionChange"
  >
    <template #dictLabel="{ record }">
      <span v-if="record.css_class && record.css_class !== ''">
        <a-tag :color="record.css_class">{{ record.dict_label }}</a-tag>
      </span>
      <span v-else-if="record.list_class && record.list_class !== ''">
        <a-tag :color="record.list_class">{{ record.dict_label }}</a-tag>
      </span>
      <span v-else>
        {{ record.dict_label }}
      </span>
    </template>
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
