<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-16 12:58:33
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\views\system\auth\dept-manage.vue
 * @Description: 
-->
<template>
  <div>
    <el-form
      v-show="showSearch"
      ref="queryRef"
      :inline="true"
      :model="queryParams"
      class="base-form"
    >
      <el-form-item :label="t('dept.name')" prop="dept_name">
        <el-input
          v-model="queryParams.dept_name"
          :placeholder="t('dept.name')"
          clearable
          @keyup.enter="getList"
        />
      </el-form-item>
      <el-form-item :label="t('dept.status')" prop="status">
        <el-select
          v-model="queryParams.status"
          :placeholder="t('dept.status')"
          clearable
        >
          <el-option
            v-for="dict in dicts[dictKey.sysNormalDisable]"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button :icon="Search" type="primary" @click="getList">
          {{ t('common.search') }}
        </el-button>
        <el-button :icon="Refresh" @click="resetQuery">
          {{ t('common.reset') }}
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 操作区域 -->
    <el-row :gutter="10" class="m-b-8px">
      <el-col :span="1.5">
        <el-button
          v-if="hasPermission(ApiSysDept.add)"
          :icon="Plus"
          plain
          type="primary"
          @click="handleAdd()"
        >
          {{ t('common.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button :icon="Sort" plain type="info" @click="toggleExpandAll">
          {{ t('common.expand') + '/' + t('common.collapse') }}
        </el-button>
      </el-col>
      <RightToolBar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>
    <!-- 表格区域 -->
    <el-table
      v-if="refreshTable"
      :data="deptTree"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      row-key="dept_id"
      tooltip-effect="light"
    >
      <el-table-column :label="t('dept.name')" prop="dept_name" width="260" />
      <el-table-column
        :label="t('common.order')"
        prop="order_num"
        show-overflow-tooltip
      />
      <el-table-column
        :label="t('common.status')"
        prop="status"
        show-overflow-tooltip
      >
        <template #default="scope">
          <DictTag
            :options="dicts[dictKey.sysNormalDisable]"
            :value="scope.row.status"
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
        v-if="hasPermission(ApiSysDept.add, ApiSysUser.edit, ApiSysDept.delete)"
        :label="t('common.operation')"
        align="center"
        width="220px"
      >
        <template #default="scope">
          <el-button
            v-if="hasPermission(ApiSysDept.edit)"
            :icon="Edit"
            link
            @click="handleUpdate(scope.row)"
          >
            {{ t('common.edit') }}
          </el-button>
          <el-button
            v-if="hasPermission(ApiSysDept.add)"
            :icon="Plus"
            link
            @click="handleAdd(scope.row)"
          >
            {{ t('common.add') }}
          </el-button>
          <el-button
            v-if="
              hasPermission(ApiSysDept.delete) && scope.row.parent_id !== '0'
            "
            :icon="Delete"
            link
            @click="handleDelete(scope.row)"
          >
            {{ t('common.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑对话框 -->
    <DeptManageDialog
      v-if="open"
      :dept-data="deptData"
      :dept-tree="deptTree"
      :open="open"
      :title="title"
      @close-dialog="closeDialog"
    />
  </div>
</template>
<script lang="ts" setup>
import { Delete, Edit, Plus, Refresh, Search } from '@element-plus/icons-vue'
import {
  type FormInstance,
  ElButton,
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElMessageBox,
  ElOption,
  ElRow,
  ElSelect,
  ElTable,
  ElTableColumn,
} from 'element-plus'
import { nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { ApiSysDept, ApiSysUser } from '@/api/apis'
import DictTag from '@/components/common/dict-tag.vue'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import {
  hasPermission,
  parseTime,
  useDelete,
  useDicts,
  useFormUtil,
  useGet,
} from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { systemMenus } from '@/router'
import type { dept, deptQueryParam } from '@/types/system/dept'
import { dictKey } from '@/types/system/dict'

import DeptManageDialog from './pages/dept-manage-dialog.vue'

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const showSearch = ref(true)
const queryRef = ref<FormInstance>()
const refreshTable = ref(true)
const isExpandAll = ref(true)
const dicts = useDicts(dictKey.sysNormalDisable)
const queryParams = ref<deptQueryParam>({})
const deptTree = ref<dept[]>([])
const open = ref(false)
const title = ref('')
const deptData = ref<dept>({
  status: '1',
})

const { formReset } = useFormUtil()

const getList = async () => {
  const { data, execute } = useGet<dept[]>(ApiSysDept.getDeptTree)
  await execute()
  deptTree.value = data.value!
}
const toggleExpandAll = () => {
  isExpandAll.value = !isExpandAll.value
  refreshTable.value = false
  nextTick(() => {
    refreshTable.value = true
  })
}
const handleAdd = (row?: dept) => {
  if (row?.dept_id) {
    deptData.value.parent_id = row.dept_id
  } else {
    deptData.value = {
      status: '1',
    }
  }
  title.value = t('dept.add')
  open.value = true
}
const handleUpdate = (row: dept) => {
  deptData.value = row
  title.value = t('dept.update') + `-${row.dept_name}`
  open.value = true
}
const handleDelete = (row: dept) => {
  ElMessageBox.confirm(`是否删除名称为 ${row.dept_name} 的数据？`, '删除确认', {
    type: 'warning',
  })
    .then(async () => {
      const { execute } = useDelete(ApiSysDept.delete, { dept_id: row.dept_id })
      await execute()
      ElMessage.success(`成功删除数据 ${row.dept_name}`)
      await getList()
    })
    .catch(() => {
      ElMessage.info(`取消删除数据 ${row.dept_name}`)
    })
}

const closeDialog = () => {
  open.value = false
  getList()
}
const resetQuery = () => {
  formReset(queryRef.value)
  getList()
}
getList()
// 组件名称
defineOptions({
  name: systemMenus.deptManage.path,
})
</script>
