<script lang="ts" setup>
import { ref } from 'vue'

import { ApiSysDept } from '@/api/apis'
import {
  deleteEmptyChildren,
  useDicts,
  useGet,
} from '@/hooks'
import type { dept, deptQueryParam } from '@/types/system/dept'
import { dictKey } from '@/types/system/dict'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import { systemMenus } from '@/router'
import DeptManageTable from '@/views/system/auth/pages/dept/dept-manage-table.vue'
import DeptManageOperator from '@/views/system/auth/pages/dept/dept-manage-operator.vue'
import DeptManageQuery from '@/views/system/auth/pages/dept/dept-mannage-query.vue'
import DeptManageModal from '@/views/system/auth/pages/dept/dept-manage-modal.vue'
import type { menu } from '@/types/system/menu'

// 导出名称
defineOptions({
  name: systemMenus.deptManage.path,
})

const showSearch = ref(true)

const modalRef = ref<InstanceType<typeof DeptManageModal>>()

const dicts = useDicts(
  dictKey.sysNormalDisable,
)

const queryParams = ref<deptQueryParam>({})

const tableData = ref<dept[]>()

async function getList() {
  // 添加参数只查询菜单和目录，不查询api
  const { data, execute } = useGet<dept[]>(
    ApiSysDept.getDeptTree,
    queryParams,
  )
  await execute()
  tableData.value = deleteEmptyChildren(data.value as menu[], 'children')
}
const handleAdd = (row?: dept) => modalRef.value?.handleAdd(row)
const handleUpdate = (row?: dept) => modalRef.value?.handleUpdate(row)
const handleDelete = (row?: dept) => modalRef.value?.handleDelete(row)
getList()
</script>

<template>
  <div>
    <DeptManageQuery
      v-model:query-params="queryParams"
      v-model:show-search="showSearch"
      :dicts="dicts"
      @get-list="getList"
    />
    <!-- 操作区域 -->
    <a-row :gutter="10" class="m-b-8px">
      <DeptManageOperator
        @hand-add="handleAdd"
      />
      <RightToolBar v-model:showSearch="showSearch" @query-table="getList" />
    </a-row>
    <!-- 表格区域 -->
    <DeptManageTable
      :is-loading="false"
      :dicts="dicts"
      :table-data="tableData || []"
      @handle-delete="handleDelete"
      @handle-update="handleUpdate"
      @handle-add="handleAdd"
    />
    <DeptManageModal
      v-if="tableData"
      ref="modalRef"
      :dept-tree="tableData"
      :dicts="dicts"
      @get-list="getList"
    />
  </div>
</template>
