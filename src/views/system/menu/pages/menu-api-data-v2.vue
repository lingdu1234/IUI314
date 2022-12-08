<template>
  <el-drawer
    ref="appSettingDrawerRef"
    :model-value="open"
    direction="btt"
    :before-close="handleClose"
    size="620px"
  >
    <template #header>
      <span class="font-bold">菜单API</span>
    </template>
    <!-- 操作区域 -->
    <el-row :gutter="10" class="m-b-8px">
      <el-col :span="1.5">
        <el-button
          v-if="hasPermission(ApiSysDictData.add)"
          :icon="Plus"
          plain
          type="primary"
          @click="handleAdd"
        >
          新增
        </el-button>
      </el-col>
    </el-row>
    <!-- 表格区域 -->
    <MenuTableDataV2
      ref="menuTableDataRef"
      :menu-data="menuData"
      :show-table="show_menu_table"
      :is-api="true"
      @get-list="getList"
      @get-menu-select-tree="getMenuSelectTree"
      @reset-menu-dialog="resetMenuDialog"
      @set-form-data="set_form_data"
    />
    <Pagination
      v-show="total > 0"
      v-model:limit="queryParams.page_size"
      v-model:page="queryParams.page_num"
      :total="total"
      @pagination="getApiList"
    />
  </el-drawer>
</template>
<script lang="ts" name="dict-data" setup>
import { Plus } from '@element-plus/icons-vue'
import { ElButton, ElCol, ElDrawer, ElRow } from 'element-plus'
import { ref } from 'vue'

import { ApiSysDictData, ApiSysMenu } from '@/api/apis'
import Pagination from '@/components/common/pagination.vue'
import { hasPermission, useListData } from '@/hooks'
import { MenuType } from '@/types/base/router'
import type { menu, menuQueryParam } from '@/types/system/menu'

import MenuTableDataV2 from './menu-table-data-v2.vue'

const props = defineProps({
  menuId: {
    type: String,
    required: true,
  },
  open: {
    type: Boolean,
    default: false,
  },
})

const show_menu_table = ref(true)

const emits = defineEmits([
  'reset-menu-dialog',
  'get-menu-select-tree',
  'get-list',
  'set-form-data',
  'close-api-data',
  'handle-add',
])

const queryParams = ref<menuQueryParam>({
  page_num: 1,
  page_size: 10,
  pid: props.menuId,
  menu_type: MenuType.F,
})

const {
  list: menuData,
  getListFn: getApiList,
  total,
} = useListData<menuQueryParam, menu>(ApiSysMenu.getList, queryParams)

const getList = () => emits('get-list')
const getMenuSelectTree = () => emits('get-menu-select-tree')
const resetMenuDialog = () => emits('reset-menu-dialog')
const set_form_data = (form_data: menu, _open: boolean, _title: string) =>
  emits('set-form-data', form_data, _open, _title)

const handleAdd = () => {
  emits('handle-add')
}

const handleClose = () => emits('close-api-data')
</script>
