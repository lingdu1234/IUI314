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
    <el-table-v2
      ref="tableV2Ref"
      :columns="columns"
      :data="menuData"
      v-model:expanded-row-keys="expandedRowKeys"
      :expand-column-key="expandColumnKey"
      row-key="id"
      :width="900"
      :height="800"
    />

    <!-- 修改对话框 -->
    <MenuDialogV2
      ref="menuDialogRef"
      :open="open"
      :title="title"
      :form-data="formData"
      :menu-select-tree="menuSelectTree"
      @closeDialog="closeDialog"
      @getList="getList"
    />
    <!-- 数据库关联对话框 -->
  </div>
</template>
<script lang="tsx" setup name="menu-table">
import { CopyDocument, Delete, Edit, FolderAdd } from '@element-plus/icons-vue'
import { useWindowSize } from '@vueuse/core'
import {
  type Column,
  type TableInstance,
  ElButton,
  ElIcon,
  ElMessage,
  ElMessageBox,
  ElTable,
  ElTableColumn,
  ElTableV2,
  ElTag,
  ElTooltip,
  TableV2,
} from 'element-plus'
import { type PropType, computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { ApiSysMenu } from '@/api/apis'
import DictTag from '@/components/common/dict-tag.vue'
import SvgIcon from '@/components/common/svg-icon.vue'
import { hasPermission, parseTime, useDelete, useDicts, useGet } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { useAppStore } from '@/stores'
import { MenuType } from '@/types/base/router'
import { dictKey } from '@/types/system/dict'
import type { menu, menuQueryParam } from '@/types/system/menu'

import MenuDialogV2 from './menu-dialog-v2.vue'
const appStore = useAppStore()

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
// menuDialogRef
const menuDialogRef = ref<InstanceType<typeof MenuDialogV2>>()

const { width } = useWindowSize()
const tableWidth = computed(() => {})

// 对话框相关参数
const open = ref(false)
const title = ref('')
// tableV2
const tableV2Ref = ref<InstanceType<typeof ElTableV2>>()
// 菜单树数据
const menuData = ref<menu[]>([])
// 菜单选择树
const menuSelectTree = ref<menu[]>([])
// 展开的key
const expandedRowKeys = ref<string[]>([])
// 展开图标的列
const expandColumnKey = 'menu_name'
watch(
  () => expandedRowKeys,
  () => {
    console.log('expandedRowKeys :>> ', expandedRowKeys.value)
    console.log('expandedRowKeys :>> ', expandedRowKeys.value.length)
    console.log('tableV2Ref :>> ', tableV2Ref.value)
  },
  {
    deep: true,
  }
)

const columns: Column<any>[] = [
  {
    key: 'menu_name',
    title: t('menu.name'),
    dataKey: 'menu_name',
    width: 200,
  },
  {
    key: 'icon',
    title: t('common.icon'),
    dataKey: 'icon',
    width: 100,
    align: 'center',
    cellRenderer: ({ cellData: icon }) => (
      <ElIcon>
        <SvgIcon name={icon} />
      </ElIcon>
    ),
  },
  {
    key: 'order_sort',
    title: t('common.order'),
    dataKey: 'order_sort',
    width: 100,
    align: 'center',
  },
  {
    key: 'api',
    title: t('common.uniqueFlag'),
    dataKey: 'api',
    width: 100,
    align: 'center',
  },
]

const closeDialog = () => (open.value = false)
const formData = ref<menu>({
  pid: '0',
  menu_name: '',
  menu_type: MenuType.M,
  order_sort: 0,
  status: '1',
  visible: '1',
  log_method: '3',
  data_cache_method: '1',
  is_frame: '0',
  is_cache: '1',
  data_scope: '0',
  remark: '',
})

// 字典数据
const dicts = useDicts(
  dictKey.sysNormalDisable,
  dictKey.sysApiMethod,
  dictKey.apiCacheMethod,
  dictKey.apiLogMethod,
  dictKey.sysShowHide,
  dictKey.db
)

const props = defineProps({
  queryParam: {
    type: Object as PropType<menuQueryParam>,
    required: true,
  },
})

const editPid = ref<string>()
//  表格操作

const resetFormData = () => {
  formData.value = {
    pid: '0',
    menu_name: '',
    menu_type: MenuType.M,
    order_sort: 0,
    status: '1',
    visible: '1',
    log_method: '3',
    data_cache_method: '1',
    is_frame: '0',
    is_cache: '1',
    data_scope: '0',
    remark: '',
  }
}

/**
 * 获取菜单数据数据
 */
const getList = async () => {
  const { data, execute } = useGet<menu[]>(
    ApiSysMenu.getEnabledTree,
    props.queryParam
  )
  await execute()
  menuData.value = data.value!
  console.log(menuData.value)
}
const getMenuSelectTree = () => {
  menuSelectTree.value = [
    {
      id: '0',
      menu_name: t('menu.mainCategory'),
      children: menuData.value,
    },
  ]
}
// 新增
const handleAdd = (row?: menu) => {
  menuDialogRef.value?.resetMenuForm()
  resetFormData()

  editPid.value = row?.pid
  // 获取菜单选择树
  getMenuSelectTree()
  // 设置pid
  if (row) {
    formData.value!.pid = row.id!
  } else {
    formData.value!.pid = '0'
  }
  // 设置 菜单名称
  formData.value.menu_name =
    row?.menu_type === MenuType.C ? row?.menu_name + '-' : undefined
  // 设置菜单类型
  let type = undefined
  if (row?.menu_type === undefined) {
    type = MenuType.M
  } else if (row?.menu_type === MenuType.M) {
    type = MenuType.C
  } else {
    type = MenuType.F
  }
  formData.value.menu_type = type
  formData.value.id = ''
  open.value = true
  title.value = t('common.add') + t('menu.menu')
}
// 将方法开放给父组件
defineExpose({ handleAdd, getList })
// 通过复制新增
const handleAddByCopy = (row: menu) => {
  menuDialogRef.value?.resetMenuForm()
  resetFormData()

  editPid.value = row.pid!
  // 获取菜单选择树
  getMenuSelectTree()
  formData.value = row
  formData.value.id = ''
  open.value = true
  title.value = t('common.copy') + t('common.add') + t('menu.menu')
}
// 编辑
const handleUpdate = (row: menu) => {
  menuDialogRef.value?.resetMenuForm()
  resetFormData()

  editPid.value = row.pid!
  // 获取菜单选择树
  getMenuSelectTree()
  formData.value = row
  open.value = true
  title.value = t('common.update') + t('menu.menu') + ' - ' + row.menu_name
}
// 删除
const handleDelete = async (row: menu) => {
  const id = row.id!
  await ElMessageBox.confirm(
    t('commonTip.delete') + row.menu_name + '?',
    t('commonTip.deleteTitle'),
    {
      type: 'warning',
    }
  )
    .then(async () => {
      const { execute } = useDelete(ApiSysMenu.delete, { id })
      await execute()
      await getList()
      ElMessage.success(t('commonTip.deleteSuccess'))
    })
    .catch(() => {
      ElMessage.info(t('commonTip.deleteCancel'))
    })
}

const show_menu_table = ref(true)

await getList()
</script>
