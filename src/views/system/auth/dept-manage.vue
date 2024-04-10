<script lang="ts" setup>
import { ref } from 'vue'

import { ApiSysDept } from '@/api/apis'
import {
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

// 导出名称
defineOptions({
  name: systemMenus.deptManage.path,
})

const showSearch = ref(true)
const isExpandAll = ref(true)

const modalRef = ref<InstanceType<typeof DeptManageModal>>()

const dicts = useDicts(
  dictKey.sysNormalDisable,
)

const queryParams = ref<deptQueryParam>({})

const {
  isFetching: isLoading,
  data: dataList,
  execute: getList,
} = useGet<dept[]>(
  ApiSysDept.getDeptTree,
  queryParams,
  { immediate: true },
)
function handleAdd(row?: dept) { modalRef.value?.handleAdd(row) }
function handleUpdate(row?: dept) { modalRef.value?.handleUpdate(row) }
function handleDelete(row?: dept) { modalRef.value?.handleDelete(row) }
function changeExpandAll() {
  isExpandAll.value = !isExpandAll.value
  console.info(isExpandAll.value)
}
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
      :is-loading="isLoading"
      :dicts="dicts"
      :table-data="dataList"
      @handle-delete="handleDelete"
      @handle-update="handleUpdate"
      @handle-add="handleAdd"
    />
    <DeptManageModal
      v-if="dataList"
      ref="modalRef"
      :dept-tree="dataList"
      :dicts="dicts"
      @get-list="getList"
    />
  </div>
</template>
