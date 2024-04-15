<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import AuthManageTable from './pages/auth/auth-manage-table.vue'
import AuthManageModal from './pages/auth/auth-manage-modal.vue'
import ApiManageQuery from '@/views/system/menu/pages/api/api-manage-query.vue'
import { type listType, useDeleteFn, useDicts, useGet, useTableUtil } from '@/hooks'
import { dictKey } from '@/types/system/dict'
import type { authMenu, menu, menuQueryParam } from '@/types/system/menu'
import { MenuType } from '@/types/base/router'
import { ApiSysMenu } from '@/api/sysApis'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import Pagination from '@/components/common/pagination.vue'
import type MenuManageModal from '@/views/system/menu/pages/menu/menu-manage-modal.vue'
import { useMenuData } from '@/stores'
import type { userInformation } from '@/types/system/userInformation'
import { systemMenus } from '@/router'

defineOptions({
  name: systemMenus.menu_auth.path,
})

const dicts = useDicts(
  dictKey.sysNormalDisable,
  dictKey.sysApiMethod,
  dictKey.apiCacheMethod,
  dictKey.apiLogMethod,
  dictKey.sysShowHide,
  dictKey.db,
)
const showSearch = ref(true)
const modalRef = ref<InstanceType<typeof AuthManageModal>>()
const queryParams = ref<menuQueryParam>({
  page_num: 1,
  page_size: 10,
  menu_type: MenuType.F,
})
const {
  isFetching: isLoading,
  data: dataList,
  execute: getList,
} = useGet<listType<authMenu>>(
  ApiSysMenu.getAuthList,
  queryParams,
  { immediate: true },
)
const handleUpdate = (row: menu) => modalRef.value?.handleUpdate(row)
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
      <RightToolBar v-model:showSearch="showSearch" @query-table="getList" />
    </a-row>
    <!-- 表格区域 -->
    <AuthManageTable
      :is-loading="isLoading"
      :dicts="dicts"
      :table-data="dataList?.list || []"
      @handle-update="handleUpdate"
    />
    <Pagination
      v-show="dataList?.total && dataList.total > 0"
      v-model:limit="queryParams.page_size"
      v-model:page="queryParams.page_num"
      :total="dataList?.total" @pagination="getList"
    />
    <AuthManageModal
      ref="modalRef"
      :dicts="dicts"
      @get-list="getList"
    />
  </div>
</template>

<style scoped lang="scss"></style>
