<script lang="ts" setup>
import { type PropType, h } from 'vue'
import { type TableColumnData, Tag } from '@arco-design/web-vue'
import DictTag from '@/components/common/dict-tag.vue'
import { dictKey, type dictUse } from '@/types/system/dict'
import { hasPermission, parseTime } from '@/hooks'
import { ApiSysMenu } from '@/api/sysApis'
import type { authMenu } from '@/types/system/menu'

defineOptions({ name: 'AuthManageTable' })
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
])

const tableData = defineModel<authMenu[] | null>('tableData', { required: true })

// 表格列属性
const columns: TableColumnData[] = [
  {
    title: '排序ID',
    dataIndex: 'order_sort',
    ellipsis: true,
    tooltip: true,
    width: 100,
    align: 'left',
  },
  {
    title: '菜单名称',
    dataIndex: 'menu_name',
    ellipsis: true,
    tooltip: true,
    width: 150,
    align: 'left',
  },
  {
    title: 'API',
    dataIndex: 'api',
    ellipsis: true,
    tooltip: true,
    width: 150,
    align: 'left',
  },
  {
    title: '请求方法',
    align: 'center',
    width: 100,
    render: ({ record }) => h(DictTag, {
      options: props.dicts[dictKey.sysApiMethod],
      value: record.method,
    }),
  },
  {
    title: '数据权限',
    align: 'center',
    width: 120,
    render: ({ record }) => record.method === 'GET'
      ? h(DictTag, {
        options: props.dicts[dictKey.sysNormalDisable],
        value: record.data_scope,
      })
      : h(Tag, {
        color: 'red',
      }, () => 'NOT SUPPORT'),
  },
  {
    title: '数据库',
    slotName: 'dataBase',
    width: 160,
    ellipsis: true,
  },
  {
    title: 'APIS',
    slotName: 'APIS',
    width: 160,
    ellipsis: true,
  },
  {
    title: '日志',
    width: 100,
    align: 'center',
    render: ({ record }) => h(DictTag, {
      options: props.dicts[dictKey.apiLogMethod],
      value: record.log_method,
    }),
  },
  {
    title: '缓存',
    width: 100,
    align: 'center',
    render: ({ record }) => h(DictTag, {
      options: props.dicts[dictKey.apiCacheMethod],
      value: record.data_cache_method,
    }),
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
    row-key="id"
    :scroll="{ minWidth: 800 }"
    :pagination="false"
  >
    <template #dataBase="{ record }">
      <a-popover title="关联数据库">
        <div v-if="record.dbs.length > 1">
          <span style="color: red;" class="m-r-5px">↑</span>
          <span>{{ record.dbs[0] }}</span>
        </div>
        <span v-if="record.dbs.length === 1">
          {{ record.dbs[0] }}
        </span>
        <span v-if="record.dbs.length === 0">
          ""
        </span>
        <template #content>
          <li v-for="(it, index) in record.dbs" :key="it + index">
            {{ it }}
          </li>
        </template>
      </a-popover>
    </template>
    <template #APIS="{ record }">
      <a-popover title="关联APIS">
        <div v-if="record.apis.length > 1">
          <span style="color: red;" class="m-r-5px">↑</span>
          <span>{{ record.apis[0] }}</span>
        </div>
        <span v-if="record.apis.length === 1">
          {{ record.apis[0] }}
        </span>
        <span v-if="record.apis.length === 0">
          ""
        </span>
        <template #content>
          <li v-for="(it, index) in record.apis" :key="it + index">
            {{ it }}
          </li>
        </template>
      </a-popover>
    </template>
    <template #operation="{ record }">
      <a-space>
        <a-tooltip
          v-if="hasPermission(ApiSysMenu.edit)"
          content="编辑"
        >
          <a-button
            type="text"
            shape="circle"
            status="success"
            @click="emits('handleUpdate', record)"
          >
            数据库关联
            <template #icon>
              <IconEdit />
            </template>
          </a-button>
        </a-tooltip>
      </a-space>
    </template>
  </a-table>
</template>
