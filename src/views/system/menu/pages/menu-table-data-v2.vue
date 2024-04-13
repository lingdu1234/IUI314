<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-13 09:59:51
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\views\system\menu\pages\menu-table-data-v2.vue
 * @Description:
-->
<script lang="ts" setup name="menu-table">
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
import { hasPermission, parseTime, useDelete, useDicts } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { MenuType } from '@/types/base/router'
import { dictKey } from '@/types/system/dict'
import type { menu } from '@/types/system/menu'

const props = defineProps({
  menuData: {
    type: Array as PropType<menu[]>,
    required: true,
  },
  showTable: {
    type: Boolean,
    default: false,
  },
  isApi: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits([
  'reset-menu-dialog',
  'get-menu-select-tree',
  'get-list',
  'get-api-list',
  'set-form-data',
  'set-menu-id',
])

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
// menuDialogRef

// 展开的key
const expandedRowKeys = ref<string[]>([])

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
  dictKey.db,
)

//  表格操作

function resetFormData() {
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

// 新增
function handleAdd(row?: menu) {
  emits('reset-menu-dialog')
  resetFormData()

  // 获取菜单选择树
  emits('get-menu-select-tree')
  // 设置pid
  if (row)
    formData.value!.pid = row.id!
  else
    formData.value!.pid = '0'

  // 设置 菜单名称
  formData.value.menu_name
    = row?.menu_type === MenuType.C ? `${row?.menu_name}-` : undefined
  // 设置菜单类型
  let type
  if (row?.menu_type === undefined)
    type = MenuType.M
  else if (row?.menu_type === MenuType.M)
    type = MenuType.C
  else
    type = MenuType.F

  formData.value.menu_type = type
  formData.value.id = ''
  const title = t('common.add') + t('menu.menu')

  emits('set-form-data', formData.value, true, title)
}
// 通过复制新增
function handleAddByCopy(row: menu) {
  emits('reset-menu-dialog')
  resetFormData()

  // 获取菜单选择树
  emits('get-menu-select-tree')
  formData.value = row
  formData.value.id = ''
  const title = t('common.copy') + t('common.add') + t('menu.menu')
  emits('set-form-data', formData.value, true, title)
}
// 编辑
function handleUpdate(row: menu) {
  emits('reset-menu-dialog')
  resetFormData()

  // 获取菜单选择树
  emits('get-menu-select-tree')
  formData.value = row
  const title = `${t('common.update') + t('menu.menu')} - ${row.menu_name}`
  emits('set-form-data', formData.value, true, title)
}
// 删除
async function handleDelete(row: menu) {
  const id = row.id!
  await ElMessageBox.confirm(
    `${t('commonTip.delete') + row.menu_name}?`,
    t('commonTip.deleteTitle'),
    {
      type: 'warning',
    },
  )
    .then(async () => {
      const { execute } = useDelete(ApiSysMenu.delete, { id })
      await execute()
      // 获取菜单选择树
      if (!props.isApi)
        emits('get-list')
      else
        emits('get-api-list')

      ElMessage.success(t('commonTip.deleteSuccess'))
    })
    .catch(() => {
      ElMessage.info(t('commonTip.deleteCancel'))
    })
}
// goto api
const goto_api = (row: menu) => emits('set-menu-id', row.id)
// 将方法开放给父组件
defineExpose({ handleAdd })
</script>

<template>
  <div>
    <!-- 表格区域 -->
    <ElTable
      v-if="showTable"
      v-model:expanded-row-keys="expandedRowKeys"
      :data="menuData"
      row-key="id"
      tooltip-effect="light"
    >
      <ElTableColumn
        prop="menu_name"
        :label="t('menu.name')"
        :show-overflow-tooltip="true"
        width="200"
      />
      <ElTableColumn
        prop="icon"
        :label="t('common.icon')"
        align="center"
        width="100"
      >
        <template #default="scope">
          <ElIcon>
            <SvgIcon :name="scope.row.icon" />
          </ElIcon>
        </template>
      </ElTableColumn>
      <ElTableColumn
        prop="order_sort"
        :label="t('common.order')"
        width="100"
      />
      <ElTableColumn
        prop="api"
        :label="t('common.uniqueFlag')"
        :show-overflow-tooltip="true"
      />
      <ElTableColumn
        prop="component"
        :label="t('menu.comp')"
        :show-overflow-tooltip="true"
      />
      <ElTableColumn prop="method" :label="t('menu.method')" width="80">
        <template #default="scope">
          <DictTag
            :options="dicts[dictKey.sysApiMethod]"
            :value="scope.row.method"
          />
        </template>
      </ElTableColumn>
      <ElTableColumn prop="method" :label="t('menu.dataScope')" width="100">
        <template #default="scope">
          <DictTag
            v-if="scope.row.method == 'GET'"
            :options="dicts[dictKey.sysNormalDisable]"
            :value="scope.row.data_scope"
          />
          <ElTag v-else>
            not support
          </ElTag>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="status" :label="t('common.status')" width="60">
        <template #default="scope">
          <DictTag
            :options="dicts[dictKey.sysNormalDisable]"
            :value="scope.row.status"
          />
        </template>
      </ElTableColumn>
      <ElTableColumn prop="visible" :label="t('common.show')" width="60">
        <template #default="scope">
          <DictTag
            :options="dicts[dictKey.sysShowHide]"
            :value="scope.row.visible"
          />
        </template>
      </ElTableColumn>
      <ElTableColumn
        :label="t('common.createTime')"
        align="center"
        prop="created_at"
        show-overflow-tooltip
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.created_at) }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn
        v-if="hasPermission(ApiSysMenu.edit, ApiSysMenu.add, ApiSysMenu.delete)"
        :label="t('common.operation')"
        align="center"
        width="200"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <ElTooltip
            v-if="scope.row.menu_type == MenuType.C"
            content="API"
            placement="top"
            effect="light"
          >
            <ElButton
              link
              :icon="FolderAdd"
              style="color: red"
              @click="goto_api(scope.row)"
            />
          </ElTooltip>
          <ElTooltip
            v-if="hasPermission(ApiSysMenu.edit)"
            :content="t('common.edit')"
            placement="top"
            effect="light"
          >
            <ElButton
              link
              :icon="Edit"
              style="color: chocolate"
              @click="handleUpdate(scope.row)"
            />
          </ElTooltip>
          <ElTooltip
            v-if="hasPermission(ApiSysMenu.edit)"
            :content="t('common.copy')"
            placement="top"
            effect="light"
          >
            <ElButton
              link
              :icon="CopyDocument"
              style="color: violet"
              @click="handleAddByCopy(scope.row)"
            />
          </ElTooltip>
          <ElTooltip
            v-if="
              scope.row.menu_type == MenuType.M && hasPermission(ApiSysMenu.add)
            "
            :content="t('common.add')"
            placement="top"
            effect="light"
          >
            <ElButton link :icon="FolderAdd" @click="handleAdd(scope.row)" />
          </ElTooltip>
          <ElTooltip
            v-if="hasPermission(ApiSysMenu.delete)"
            :content="t('common.delete')"
            placement="top"
            effect="light"
          >
            <ElButton
              style="color: red"
              link
              :icon="Delete"
              @click="handleDelete(scope.row)"
            />
          </ElTooltip>
        </template>
      </ElTableColumn>
    </ElTable>
  </div>
</template>
