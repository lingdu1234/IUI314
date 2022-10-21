<template>
  <div>
    <el-form
      v-show="showSearch"
      ref="queryRef"
      :inline="true"
      :model="queryParams"
      class="base-form"
      label-width="68px"
    >
      <el-form-item label="角色名称" prop="role_name">
        <el-input
          v-model="queryParams.role_name"
          clearable
          placeholder="请输入角色名称"
          @keyup.enter="getList"
        />
      </el-form-item>
      <el-form-item label="权限字符" prop="role_key">
        <el-input
          v-model="queryParams.role_key"
          clearable
          placeholder="请输入权限字符"
          @keyup.enter="getList"
        />
      </el-form-item>
      <el-form-item label="角色状态" prop="status">
        <el-select
          v-model="queryParams.status"
          clearable
          placeholder="角色状态"
        >
          <el-option
            v-for="dict in dicts[dictKey.sysNormalDisable]"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button :icon="Search" type="primary" @click="getList">
          搜索
        </el-button>
        <el-button :icon="Refresh" @click="resetQuery"> 重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="m-b-8px" style="height: 35px">
      <el-col :span="1.5">
        <el-button
          v-if="hasPermission(ApiSysRole.add)"
          :icon="Plus"
          plain
          type="primary"
          @click="handleAdd"
        >
          新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-if="hasPermission(ApiSysRole.edit)"
          :disabled="!single"
          :icon="Edit"
          plain
          type="success"
          @click="handleUpdate"
        >
          修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-if="hasPermission(ApiSysRole.delete)"
          :disabled="!selected"
          :icon="Delete"
          plain
          type="danger"
          @click="handleDelete"
        >
          删除
        </el-button>
      </el-col>
      <RightToolBar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>
    <!--    表格区域-->
    <el-table
      :data="roleListData"
      @selection-change="handleSelectionChange"
      tooltip-effect="light"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="角色编号" prop="role_id" show-overflow-tooltip />
      <el-table-column
        label="角色名称"
        prop="role_name"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column
        label="权限字符"
        prop="role_key"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column label="显示顺序" prop="list_order" width="100" />
      <el-table-column label="状态" align="center" width="100">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="1"
            inactive-value="0"
            :disabled="!hasPermission(ApiSysRole.changeStatus)"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="created_at"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.created_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="hasPermission(ApiSysRole.edit, ApiSysRole.delete)"
        align="center"
        label="操作"
        width="150px"
      >
        <template #default="scope">
          <el-tooltip
            content="修改"
            placement="top"
            effect="light"
            v-if="hasPermission(ApiSysRole.edit) && scope.row.role_id !== 1"
          >
            <el-button link :icon="Edit" @click="handleUpdate(scope.row)" />
          </el-tooltip>
          <el-tooltip
            content="删除"
            placement="top"
            effect="light"
            v-if="hasPermission(ApiSysRole.delete) && scope.row.role_id !== 1"
          >
            <el-button link :icon="Delete" @click="handleDelete(scope.row)" />
          </el-tooltip>
          <el-tooltip
            content="数据权限"
            placement="top"
            effect="light"
            v-if="hasPermission(ApiSysRole.setDataScope)"
          >
            <el-button
              link
              :icon="CircleCheck"
              @click="handleDataScope(scope.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      v-model:limit="queryParams.page_size"
      v-model:page="queryParams.page_num"
      :total="total"
      @pagination="getList"
    />
    <!--    编辑form区域-->
    <RoleManageDialog
      v-if="open"
      :open="open"
      :role-data="roleData"
      :title="title"
      @close-dialog="closeDialog"
    />
    <!-- 数据权限对话框 -->
    <RoleManageDataScopeDialog
      v-if="openDataScope"
      :open-data-scope="openDataScope"
      :role-data="roleData"
      :title="title"
      @close-dialog="closeDialog"
    />
  </div>
</template>
<script lang="ts" setup>
import {
  CircleCheck,
  Delete,
  Edit,
  Plus,
  Refresh,
  Search,
} from '@element-plus/icons-vue'
import { type FormInstance, ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'

import { ApiSysRole } from '@/api/apis'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import {
  hasPermission,
  parseTime,
  useDeleteFn,
  useDicts,
  useFormUtil,
  useListData,
  usePut,
  useTableUtil,
} from '@/hooks'
import { systemMenus } from '@/router'
import { dictKey } from '@/types/system/dict'
import type { role, roleQueryParam } from '@/types/system/role'

import RoleManageDataScopeDialog from './pages/role-manage-data-scope-dialog.vue'
import RoleManageDialog from './pages/role-manage-dialog.vue'

const showSearch = ref(true)
const queryRef = ref<FormInstance>()
const dicts = useDicts(dictKey.sysNormalDisable)
const open = ref(false)
const openDataScope = ref(false)
const title = ref('')
const roleData = ref<role>({})
const { useTableSelectChange } = useTableUtil()
const { formReset } = useFormUtil()
const dateRange = ref<string[]>([])

const queryParams = ref<roleQueryParam>({
  page_size: 10,
  page_num: 1,
})

const {
  list: roleListData,
  getListFn: getList,
  total,
} = useListData<roleQueryParam, role>(ApiSysRole.getList, queryParams)

const { handleSelectionChangeFn, ids, values, single, selected } =
  useTableSelectChange()

const handleSelectionChange = (v: role[]) =>
  handleSelectionChangeFn(v, 'role_id', 'role_name')

const handleAdd = () => {
  roleData.value = { status: '1' }
  title.value = '新增角色'
  open.value = true
}
const handleUpdate = (row: role) => {
  roleData.value = row
  title.value = `更新角色-${row.role_name}`
  open.value = true
}
const handleDataScope = (row: role) => {
  roleData.value = row
  title.value = `更新数据权限-${row.role_name}`
  openDataScope.value = true
}

const handleDelete = async (row?: role) => {
  const flag = await useDeleteFn(
    ApiSysRole.delete,
    'role_id',
    ids,
    'role_name',
    values,
    'role_ids',
    row
  )
  if (flag) await getList()
}
const handleStatusChange = async (row: role) => {
  const text = row.status === '1' ? '启用' : '停用'
  await ElMessageBox.confirm(
    `确定要  ${text}  ${row.role_name}  吗?`,
    '角色状态',
    { type: 'warning' }
  )
    .then(async () => {
      const { execute } = usePut(ApiSysRole.changeStatus, {
        role_id: row.role_id,
        status: row.status,
      })
      await execute()
      ElMessage.success(`你成功 ${text} 用户 ${row.role_name}`)
      getList()
    })
    .catch(() => {
      ElMessage.info('你取消了操作')
      row.status = row.status === '0' ? '1' : '0'
    })
}

const resetQuery = () => {
  formReset(queryRef.value)
  getList()
}

const closeDialog = () => {
  open.value = false
  openDataScope.value = false
  getList()
}

//组件名称
defineOptions({
  name: systemMenus.roleManage.path,
})
</script>
