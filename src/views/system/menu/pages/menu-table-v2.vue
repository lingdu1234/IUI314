<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-13 09:59:51
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\views\system\menu\pages\menu-table-v2.vue
 * @Description: 
-->
<template>
  <div>
    <!-- 表格区域 -->
    <MenuTableDataV2
      ref="menuTableDataRef"
      :menu-data="menuData"
      :show-table="show_menu_table"
      @get-list="getList"
      @get-menu-select-tree="getMenuSelectTree"
      @reset-menu-dialog="resetMenuDialog"
      @set-form-data="set_form_data"
      @set-menu-id="set_menu_id"
    />

    <!-- 修改对话框 -->
    <MenuDialogV2
      ref="menuDialogRef"
      :open="open"
      :title="title"
      :form-data="formData"
      :menu-select-tree="menuSelectTree"
      :is-api="isApi"
      @closeDialog="closeDialog"
      @getList="getList"
    />
    <!-- api drawer -->
    <MenuApiDataV2
      v-if="openMenuApiDrawer"
      :open="openMenuApiDrawer"
      :menu-id="menuID"
      @get-list="getList"
      @get-menu-select-tree="getMenuSelectTree"
      @reset-menu-dialog="resetMenuDialog"
      @set-form-data="set_form_data"
      @close-api-data="closeApiData"
      @handle-add="handleAdd"
    />
  </div>
</template>
<script lang="ts" setup name="menu-table">
import { type PropType, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { ApiSysMenu } from '@/api/apis'
import { useGet } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { MenuType } from '@/types/base/router'
import type { menu, menuQueryParam } from '@/types/system/menu'

import MenuApiDataV2 from './menu-api-data-v2.vue'
import MenuDialogV2 from './menu-dialog-v2.vue'
import MenuTableDataV2 from './menu-table-data-v2.vue'

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
// menuDialogRef menuTableDataRef
const menuDialogRef = ref<InstanceType<typeof MenuDialogV2>>()
const menuTableDataRef = ref<InstanceType<typeof MenuTableDataV2>>()

const show_menu_table = ref(true)
const openMenuApiDrawer = ref(false)

// 对话框相关参数
const open = ref(false)
const title = ref('')

// 菜单树数据
const menuData = ref<menu[]>([])
// 菜单编辑目录选择树
const menuSelectTree = ref<menu[]>([])
// 展开的key

const closeDialog = () => (open.value = false)
const formData = ref<menu>({})

const props = defineProps({
  queryParam: {
    type: Object as PropType<menuQueryParam>,
    required: true,
  },
})

const menuID = ref<string>('0')
const isApi = ref<boolean>(false)

/**
 * 获取菜单数据数据
 */
const getList = async () => {
  const queryParam: menuQueryParam = props.queryParam
  // 添加参数只查询菜单和目录，不查询api
  queryParam.menu_types = [MenuType.C, MenuType.M].join(',')
  const { data, execute } = useGet<menu[]>(
    ApiSysMenu.getEnabledTree,
    queryParam
  )
  await execute()
  menuData.value = data.value!
}
/**
 * 获取表单供选择的菜单数
 */
const getMenuSelectTree = async () => {
  const queryParam: menuQueryParam = {
    // 查询所有目录菜单，只有目录才能才能作为上级菜单
    menu_type: MenuType.M,
  }
  const { data, execute } = useGet<menu[]>(
    ApiSysMenu.getEnabledTree,
    queryParam
  )
  await execute()
  menuSelectTree.value = [
    {
      id: '0',
      menu_name: t('menu.mainCategory'),
      children: data.value!,
    },
  ]
}

// 设置formData
const set_form_data = (form_data: menu, _open: boolean, _title: string) => {
  formData.value = form_data
  open.value = _open
  title.value = _title
}

// 重置菜单对话框
const resetMenuDialog = () => {
  menuDialogRef.value?.resetMenuForm()
}
// handleAdd
const handleAdd = async () => {
  menuTableDataRef.value?.handleAdd()
}

const set_menu_id = (id: string) => {
  menuID.value = id
  openMenuApiDrawer.value = true
  isApi.value = true
}

const closeApiData = () => {
  menuID.value = '0'
  openMenuApiDrawer.value = false
  isApi.value = false
}
defineExpose({ getList, handleAdd })
await getList()
</script>
