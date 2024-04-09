<script lang="ts" setup>
import { type PropType, ref, watch } from 'vue'

import { ApiSysDictType, ApiSysUser } from '@/api/apis'
import Pagination from '@/components/common/pagination.vue'
import {
  type listType,
  useDeleteFn,
  useDicts,
  useGet,
  useTableUtil,
} from '@/hooks'
import UserManageModal from '@/views/system/auth/pages/user/user-manage-modal.vue'
import type { dept } from '@/types/system/dept'
import type { userInformation, userQueryParam } from '@/types/system/userInformation'
import { dictKey } from '@/types/system/dict'
import UserManageTable from '@/views/system/auth/pages/user/user-manage-table.vue'
import UserManageQuery from '@/views/system/auth/pages/user/user-mannage-query.vue'
import UserManageOperater from '@/views/system/auth/pages/user/user-manage-operater.vue'
import RightToolBar from '@/components/common/right-tool-bar.vue'

// 导出名称
defineOptions({
  name: 'UserManageForm',
})
const props = defineProps({
  deptIds: {
    type: Array as PropType<string[]>,
    required: true,
  },
  deptTree: {
    type: Array as PropType<dept[]>,
    required: true,
  },
})

const showSearch = ref(true)

const modalRef = ref<InstanceType<typeof UserManageModal>>()

const dicts = useDicts(
  dictKey.sysNormalDisable,
  dictKey.sysUserSex,
  dictKey.isAdmin,
)

const { useTableSelectChange } = useTableUtil()
const { handleSelectionChangeFnX, ids, values, single, selected }
    = useTableSelectChange()

const queryParams = ref<userQueryParam>({
  page_num: 1,
  page_size: 10,
})

const {
  isFetching: isLoading,
  data: dataList,
  execute: getList,
} = useGet<listType<userInformation>>(
  ApiSysUser.getList,
  queryParams,
  { immediate: true },
)

const handAdd = () => modalRef.value?.handleAdd()
const handleUpdate = (row?: userInformation) => modalRef.value?.handleUpdate(row)

async function handleDelete(row?: userInformation) {
  await useDeleteFn(
    ApiSysDictType.delete,
    'id',
    ids,
    'user_name',
    values,
    'use_ids',
    row,
    getList,
  )
}
watch(
  () => props.deptIds,
  (v) => {
    queryParams.value.dept_ids = v
    getList()
  },
)
</script>

<template>
  <div>
    <UserManageQuery
      v-model:query-params="queryParams"
      v-model:show-search="showSearch"
      :dicts="dicts"
      @get-list="getList"
    />
    <!-- 操作区域 -->
    <a-row :gutter="10" class="m-b-8px">
      <UserManageOperater
        :selected="selected"
        :single="single"
        @handle-delete="handleDelete"
        @handle-update="handleUpdate"
        @hand-add="handAdd"
      />
      <RightToolBar v-model:showSearch="showSearch" @query-table="getList" />
    </a-row>
    <!-- 表格区域 -->
    <UserManageTable
      :is-loading="isLoading"
      :dicts="dicts"
      :table-data="dataList && dataList?.list"
      @handle-delete="handleDelete"
      @handle-update="handleUpdate"
      @handle-selection-change-fn="handleSelectionChangeFnX"
    />
    <Pagination
      v-show="dataList?.total && dataList.total > 0"
      v-model:limit="queryParams.page_size"
      v-model:page="queryParams.page_num"
      :total="dataList?.total"
      @pagination="getList"
    />
    <UserManageModal
      v-if="deptTree"
      ref="modalRef"
      :ids="ids"
      :dept-tree="deptTree"
      :dicts="dicts"
      @get-list="getList"
    />
  </div>
</template>
