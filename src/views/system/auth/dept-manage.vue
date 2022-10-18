<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-16 12:58:33
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-18 08:51:01
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
      <el-form-item label="部门名称" prop="dept_name">
        <el-input
          v-model="queryParams.dept_name"
          clearable
          placeholder="请输入部门名称"
          @keyup.enter="getList"
        />
      </el-form-item>
      <el-form-item label="部门状态" prop="status">
        <el-select
          v-model="queryParams.status"
          clearable
          placeholder="部门状态"
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
          搜索
        </el-button>
        <el-button :icon="Refresh" @click="resetQuery"> 重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 操作区域 -->
    <el-row :gutter="10" class="m-b-8px" style="height: 35px">
      <el-col :span="1.5">
        <el-button
          v-if="hasPermission(ApiSysDept.add)"
          :icon="Plus"
          plain
          type="primary"
          @click="handleAdd"
        >
          新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button :icon="Sort" plain type="info" @click="toggleExpandAll">
          展开/折叠
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
      <el-table-column label="部门名称" prop="dept_name" width="260" />
      <el-table-column label="排序" prop="order_num" show-overflow-tooltip />
      <el-table-column label="状态" prop="status" show-overflow-tooltip>
        <template #default="scope">
          <dict-tag
            :options="dicts[dictKey.sysNormalDisable]"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="创建时间"
        prop="created_at"
        show-overflow-tooltip
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.created_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="hasPermission(ApiSysDept.add, ApiSysUser.edit, ApiSysDept.delete)"
        align="center"
        label="操作"
        width="220px"
      >
        <template #default="scope">
          <el-button
            v-if="hasPermission(ApiSysDept.edit)"
            :icon="Edit"
            link
            @click="handleUpdate(scope.row)"
          >
            修改
          </el-button>
          <el-button
            v-if="hasPermission(ApiSysDept.add)"
            :icon="Plus"
            link
            @click="handleAdd(scope.row)"
          >
            新增
          </el-button>
          <el-button
            v-if="
              hasPermission(ApiSysDept.delete) && scope.row.parent_id !== '0'
            "
            :icon="Delete"
            link
            @click="handleDelete(scope.row)"
          >
            删除
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
import {
  Delete,
  Edit,
  Plus,
  Refresh,
  Search,
  Sort,
} from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { nextTick, ref } from 'vue'

import { ApiSysDept, ApiSysUser } from '@/api/apis'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import {
  hasPermission,
  parseTime,
  useDelete,
  useDicts,
  useFormUtil,
  useGet,
} from '@/hooks'
import { systemMenus } from '@/router'
import type { dept, deptQueryParam } from '@/types/system/dept'
import { dictKey } from '@/types/system/dict'

import DeptManageDialog from './pages/dept-manage-dialog.vue'

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
  title.value = '新增部门'
  open.value = true
}
const handleUpdate = (row: dept) => {
  deptData.value = row
  title.value = `更新部门-${row.dept_name}`
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
