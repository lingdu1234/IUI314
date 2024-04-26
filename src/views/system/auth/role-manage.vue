<script lang="ts" setup>
import { ref } from 'vue'

import { ApiSysRole } from '@/api/apis'
import Pagination from '@/components/common/pagination.vue'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import {
  type listType,
  useDeleteFn,
  useDicts,
  useGet,
  useTableUtil,
} from '@/hooks'
import { systemMenus } from '@/router'
import { dictKey } from '@/types/system/dict'
import type { postQueryParam } from '@/types/system/post'
import type { role } from '@/types/system/role'
import type { userInformation } from '@/types/system/userInformation'
import type PostManageModal from '@/views/system/auth/pages/post/post-manage-modal.vue'
import RoleManageDataModal from '@/views/system/auth/pages/role/role-manage-data-modal.vue'
import RoleManageModal from '@/views/system/auth/pages/role/role-manage-modal.vue'
import RoleManageOperator from '@/views/system/auth/pages/role/role-manage-operator.vue'
import RoleManageQuery from '@/views/system/auth/pages/role/role-manage-query.vue'
import RoleManageTable from '@/views/system/auth/pages/role/role-manage-table.vue'

// 导出名称
defineOptions({
  name: systemMenus.roleManage.path,
})

const showSearch = ref(true)

const modalRef = ref<InstanceType<typeof PostManageModal>>()
const dataModalRef = ref<InstanceType<typeof PostManageModal>>()

const dicts = useDicts(
  dictKey.sysNormalDisable,
)

const { useTableSelectChange } = useTableUtil()
const { handleSelectionChangeFnX, ids, values, single, selected }
    = useTableSelectChange()

const queryParams = ref<postQueryParam>({
  page_size: 10,
  page_num: 1,
})

const {
  isFetching: isLoading,
  data: dataList,
  execute: getList,
} = useGet<listType<role>>(
  ApiSysRole.getList,
  queryParams,
  { immediate: true },
)

const handAdd = () => modalRef.value?.handleAdd()
const handleUpdate = (row?: userInformation) => modalRef.value?.handleUpdate(row)
const handleDataUpdate = (row?: userInformation) => dataModalRef.value?.handleUpdate(row)
async function handleDelete(row?: userInformation) {
  await useDeleteFn(
    ApiSysRole.delete,
    'role_id',
    ids,
    'role_name',
    values,
    'role_ids',
    row,
    getList,
  )
}
</script>

<template>
  <div>
    <RoleManageQuery
      v-model:query-params="queryParams"
      v-model:show-search="showSearch"
      :dicts="dicts"
      @get-list="getList"
    />
    <!-- 操作区域 -->
    <a-row :gutter="10" class="m-b-8px">
      <RoleManageOperator
        :selected="selected"
        :single="single"
        @handle-delete="handleDelete"
        @handle-update="handleUpdate"
        @hand-add="handAdd"
      />
      <RightToolBar v-model:showSearch="showSearch" @query-table="getList" />
    </a-row>
    <!-- 表格区域 -->
    <RoleManageTable
      :is-loading="isLoading"
      :dicts="dicts"
      :table-data="dataList && dataList?.list"
      @handle-delete="handleDelete"
      @handle-update="handleUpdate"
      @handle-data-update="handleDataUpdate"
      @handle-selection-change-fn="handleSelectionChangeFnX"
      @get-list="getList"
    />
    <Pagination
      v-show="dataList?.total && dataList.total > 0"
      v-model:limit="queryParams.page_size"
      v-model:page="queryParams.page_num"
      :total="dataList?.total"
      @pagination="getList"
    />
    <RoleManageModal
      ref="modalRef"
      :ids="ids"
      :dicts="dicts"
      @get-list="getList"
    />
    <RoleManageDataModal
      ref="dataModalRef"
      :ids="ids"
      :dicts="dicts"
      @get-list="getList"
    />
  </div>
</template>
