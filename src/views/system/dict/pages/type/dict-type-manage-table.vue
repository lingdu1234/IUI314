<script lang="ts" setup>
import { type PropType, computed, h, ref } from 'vue'
import type { TableColumnData, TableRowSelection } from '@arco-design/web-vue'
import { dictKey, type dictType, type dictUse } from '@/types/system/dict'
import { hasPermission, parseTime } from '@/hooks'
import { ApiSysPost } from '@/api/sysApis'
import type { userInformation } from '@/types/system/userInformation'
import DictTag from '@/components/common/dict-tag.vue'
import { DictDataRouteName, router } from '@/router'

defineOptions({ name: 'DictTypeManageTable' })
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
const columns = computed<TableColumnData[]>(() => [
  {
    title: '字典Id',
    dataIndex: 'dict_type_id',
    ellipsis: true,
    tooltip: true,
    width: 200,
    align: 'center',
  },
  {
    title: '字典名称',
    dataIndex: 'dict_name',
    align: 'center',
    width: 100,
  },
  {
    title: '字典类型',
    slotName: 'dict_type',
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
    title: '备注',
    dataIndex: 'remark',
    align: 'center',
    width: 100,
    ellipsis: true,
    tooltip: true,
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
])

function handleSelectionChange(keys: (string | number)[]) {
  return emits('handleSelectionChangeFn', keys, tableData.value, 'dict_type_id', 'dict_name')
}
function goto_data(row: dictType) {
  router.push({
    name: DictDataRouteName,
    query: { dict: row.dict_type_id, dict_type: row.dict_type },
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
    row-key="dict_type_id"
    :scroll="{ minWidth: 800 }"
    :pagination="false"
    @selection-change="handleSelectionChange"
  >
    <template #dict_type="{ record }">
      <a-link type="primary" @click="goto_data(record)">
        {{ record.dict_type }}
      </a-link>
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
