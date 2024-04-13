<script lang="ts" setup>
import { ref } from 'vue'

import { ApiSysMenu, ApiSysPost } from '@/api/apis'
import {
  deleteEmptyChildren,
  useDeleteFn,
  useDicts,
  useGet,
  useTableUtil,
} from '@/hooks'
import type { userInformation } from '@/types/system/userInformation'
import { dictKey } from '@/types/system/dict'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import { systemMenus } from '@/router'
import type PostManageModal from '@/views/system/auth/pages/post/post-manage-modal.vue'
import MenuManageQuery from '@/views/system/menu/pages/menu-mannage-query.vue'
import MenuManageOperator from '@/views/system/menu/pages/menu-manage-operator.vue'
import MenuManageTable from '@/views/system/menu/pages/menu-manage-table.vue'
import MenuManageModal from '@/views/system/menu/pages/menu-manage-modal.vue'
import type { menu, menuQueryParam } from '@/types/system/menu'
import { MenuType } from '@/types/base/router'

// 导出名称
defineOptions({
  name: systemMenus.menu.path,
})

const showSearch = ref(true)
// 菜单树数据
const menuData = ref<menu[]>()

const modalRef = ref<InstanceType<typeof PostManageModal>>()

const dicts = useDicts(
  dictKey.sysNormalDisable,
  dictKey.sysApiMethod,
  dictKey.apiCacheMethod,
  dictKey.apiLogMethod,
  dictKey.sysShowHide,
  dictKey.db,
)

const { useTableSelectChange } = useTableUtil()
const { handleSelectionChangeFnX, ids, values, single, selected }
    = useTableSelectChange()

const queryParams = ref<menuQueryParam>({})

async function getList() {
  // 添加参数只查询菜单和目录，不查询api
  queryParams.value.menu_types = [MenuType.C, MenuType.M].join(',')
  const { data, execute } = useGet<menu[]>(
    ApiSysMenu.getEnabledTree,
    queryParams,
  )
  await execute()
  menuData.value = deleteEmptyChildren(data.value as menu[], 'children')
}

const handAdd = () => modalRef.value?.handleAdd()
const handleUpdate = (row?: userInformation) => modalRef.value?.handleUpdate(row)

async function handleDelete(row?: userInformation) {
  await useDeleteFn(
    ApiSysPost.delete,
    'post_id',
    ids,
    'post_name',
    values,
    'post_ids',
    row,
    getList,
  )
}
getList()
</script>

<template>
  <div>
    <MenuManageQuery
      v-model:query-params="queryParams"
      v-model:show-search="showSearch"
      :dicts="dicts"
      @get-list="getList"
    />
    <!-- 操作区域 -->
    <a-row :gutter="10" class="m-b-8px">
      <MenuManageOperator
        :selected="selected"
        :single="single"
        @handle-delete="handleDelete"
        @handle-update="handleUpdate"
        @hand-add="handAdd"
      />
      <RightToolBar v-model:showSearch="showSearch" @query-table="getList" />
    </a-row>
    <!-- 表格区域 -->
    <MenuManageTable
      :is-loading="false"
      :dicts="dicts"
      :table-data="menuData || []"
      @handle-delete="handleDelete"
      @handle-update="handleUpdate"
      @handle-selection-change-fn="handleSelectionChangeFnX"
    />
    <MenuManageModal
      ref="modalRef"
      :ids="ids"
      :dicts="dicts"
      @get-list="getList"
    />
  </div>
</template>
