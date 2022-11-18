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
    <el-table
      v-if="show_menu_table"
      v-model:expanded-row-keys="expandedRowKeys"
      :data="menuData"
      row-key="id"
      tooltip-effect="light"
    >
      <el-table-column
        prop="menu_name"
        :label="t('menu.name')"
        :show-overflow-tooltip="true"
        width="200"
      />
      <el-table-column
        prop="icon"
        :label="t('common.icon')"
        align="center"
        width="100"
      >
        <template #default="scope">
          <el-icon>
            <SvgIcon :name="scope.row.icon" />
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column
        prop="order_sort"
        :label="t('common.order')"
        width="100"
      />
      <el-table-column
        prop="api"
        :label="t('common.uniqueFlag')"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="component"
        :label="t('menu.comp')"
        :show-overflow-tooltip="true"
      />
      <el-table-column prop="method" :label="t('menu.method')" width="80">
        <template #default="scope">
          <DictTag
            :options="dicts[dictKey.sysApiMethod]"
            :value="scope.row.method"
          />
        </template>
      </el-table-column>
      <el-table-column prop="method" :label="t('menu.dataScope')" width="100">
        <template #default="scope">
          <DictTag
            v-if="scope.row.method == 'GET'"
            :options="dicts[dictKey.sysNormalDisable]"
            :value="scope.row.data_scope"
          />
          <el-tag v-else>not support</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="t('common.status')" width="60">
        <template #default="scope">
          <DictTag
            :options="dicts[dictKey.sysNormalDisable]"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column prop="visible" :label="t('common.show')" width="60">
        <template #default="scope">
          <DictTag
            :options="dicts[dictKey.sysShowHide]"
            :value="scope.row.visible"
          />
        </template>
      </el-table-column>
      <el-table-column
        :label="t('common.createTime')"
        align="center"
        prop="created_at"
        show-overflow-tooltip
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.created_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('common.operation')"
        align="center"
        width="200"
        class-name="small-padding fixed-width"
        v-if="hasPermission(ApiSysMenu.edit, ApiSysMenu.add, ApiSysMenu.delete)"
      >
        <template #default="scope">
          <el-tooltip
            :content="t('common.edit')"
            placement="top"
            effect="light"
            v-if="hasPermission(ApiSysMenu.edit)"
          >
            <el-button
              link
              :icon="Edit"
              style="color: chocolate"
              @click="handleUpdate(scope.row)"
            />
          </el-tooltip>
          <el-tooltip
            :content="t('common.copy')"
            placement="top"
            effect="light"
            v-if="hasPermission(ApiSysMenu.edit)"
          >
            <el-button
              link
              :icon="CopyDocument"
              style="color: violet"
              @click="handleAddByCopy(scope.row)"
            />
          </el-tooltip>
          <el-tooltip
            :content="t('common.add')"
            placement="top"
            effect="light"
            v-if="hasPermission(ApiSysMenu.add)"
          >
            <el-button link :icon="FolderAdd" @click="handleAdd(scope.row)" />
          </el-tooltip>
          <el-tooltip
            :content="t('common.delete')"
            placement="top"
            effect="light"
            v-if="hasPermission(ApiSysMenu.delete)"
          >
            <el-button
              style="color: red"
              link
              :icon="Delete"
              @click="handleDelete(scope.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

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
import {
  ElButton,
  ElIcon,
  ElMessage,
  ElMessageBox,
  ElTable,
  ElTableColumn,
  ElTag,
  ElTooltip,
} from 'element-plus'
import { type PropType, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { ApiSysMenu } from '@/api/apis'
import DictTag from '@/components/common/dict-tag.vue'
import SvgIcon from '@/components/common/svg-icon.vue'
import { hasPermission, parseTime, useDelete, useDicts, useGet } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { MenuType } from '@/types/base/router'
import { dictKey } from '@/types/system/dict'
import type { menu, menuQueryParam } from '@/types/system/menu'

import MenuDialogV2 from './menu-dialog-v2.vue'

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
// menuDialogRef
const menuDialogRef = ref<InstanceType<typeof MenuDialogV2>>()

const show_menu_table = ref(true)

// 对话框相关参数
const open = ref(false)
const title = ref('')
const isFirstLoad = ref(true)

// 菜单树数据
const menuData = ref<menu[]>([])
const menuDataAll = ref<menu[]>([])
// 菜单编辑目录选择树
const menuSelectTree = ref<menu[]>([])
// 展开的key
const expandedRowKeys = ref<string[]>([])

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
  // show_menu_table.value = false
  const { data, execute } = useGet<menu[]>(
    ApiSysMenu.getEnabledTree,
    props.queryParam
  )
  await execute()
  menuData.value = data.value!
  // console.log(menuData.value)
  if (isFirstLoad.value) {
    menuDataAll.value = data.value!
    isFirstLoad.value = false
  }
  // show_menu_table.value = true
}
const getMenuSelectTree = () => {
  menuSelectTree.value = [
    {
      id: '0',
      menu_name: t('menu.mainCategory'),
      children: menuDataAll.value,
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

await getList()
</script>
