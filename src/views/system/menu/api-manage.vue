<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import ApiManageQuery from '@/views/system/menu/pages/api/api-manage-query.vue'
import ApiManageOperator from '@/views/system/menu/pages/api/api-manage-operator.vue'
import { type listType, useDeleteFn, useDicts, useGet, useTableUtil } from '@/hooks'
import { dictKey } from '@/types/system/dict'
import type { menu, menuQueryParam } from '@/types/system/menu'
import { MenuType } from '@/types/base/router'
import { ApiSysMenu } from '@/api/sysApis'
import ApiManageTable from '@/views/system/menu/pages/api/api-manage-table.vue'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import Pagination from '@/components/common/pagination.vue'
import MenuManageModal from '@/views/system/menu/pages/menu/menu-manage-modal.vue'
import { useMenuData } from '@/stores'
import type { userInformation } from '@/types/system/userInformation'

defineOptions({ name: 'ApiManage' })
const dicts = useDicts(
  dictKey.sysNormalDisable,
  dictKey.sysApiMethod,
  dictKey.apiCacheMethod,
  dictKey.apiLogMethod,
  dictKey.sysShowHide,
)
const route = useRoute()
const showSearch = ref(true)
const modalRef = ref<InstanceType<typeof MenuManageModal>>()
const queryParams = ref<menuQueryParam>({
  page_num: 1,
  page_size: 10,
  menu_type: MenuType.F,
  pid: route.query.id as string,
})
const {
  isFetching: isLoading,
  data: dataList,
  execute: getList,
} = useGet<listType<menu>>(
  ApiSysMenu.getList,
  queryParams,
  { immediate: true },
)
const { useTableSelectChange } = useTableUtil()
const { handleSelectionChangeFnX, ids, values, selected }
    = useTableSelectChange()
const handAdd = (row?: menu, pid?: string, menu_type?: MenuType) => modalRef.value?.handleAdd(row, pid, menu_type)
const handleAddByCopy = (row: menu) => modalRef.value?.handleAddByCopy(row)
const handleUpdate = (row: menu) => modalRef.value?.handleUpdate(row)
async function handleDelete(row?: userInformation) {
  await useDeleteFn(
    ApiSysMenu.delete,
    'id',
    ids,
    'menu_name',
    values,
    'ids',
    row,
    getList,
  )
}
</script>

<template>
  <div>
    <ApiManageQuery
      v-model:query-params="queryParams"
      v-model:show-search="showSearch"
      :dicts="dicts"
      @get-list="getList"
    />
    <!-- 操作区域 -->
    <a-row :gutter="10" class="m-b-8px">
      <ApiManageOperator
        :pid="queryParams.pid"
        :selected="selected"
        @hand-add="handAdd"
        @handle-delete="handleDelete"
      />
      <RightToolBar v-model:showSearch="showSearch" @query-table="getList" />
    </a-row>
    <!-- 表格区域 -->
    <ApiManageTable
      :is-loading="isLoading"
      :dicts="dicts"
      :table-data="dataList?.list || []"
      @handle-selection-change-fn="handleSelectionChangeFnX"
      @handle-delete="handleDelete"
      @handle-update="handleUpdate"
      @handle-add="handAdd"
      @handle-add-by-copy="handleAddByCopy"
    />
    <Pagination
      v-show="dataList?.total && dataList.total > 0"
      v-model:limit="queryParams.page_size"
      v-model:page="queryParams.page_num"
      :total="dataList?.total"
      @pagination="getList"
    />
    <MenuManageModal
      ref="modalRef"
      :dicts="dicts"
      :menu-tree="useMenuData().getMenuTreeSelect"
      ids=""
      @get-list="getList"
    />
  </div>
</template>

<style scoped lang="scss">

</style>
