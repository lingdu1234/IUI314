<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-15 18:47:35
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-16 14:57:14
 * @FilePath: \IUI314\src\views\system\auth\components\user-manage-form.vue
 * @Description: 
-->
<template>
  <div>
    <el-form
      v-show="showSearch"
      ref="queryRef"
      :inline="true"
      :model="queryParams"
      label-width="68px"
      class="base-form"
    >
      <el-form-item label="用户名称" prop="user_name">
        <el-input
          v-model="queryParams.user_name"
          placeholder="请输入用户名称"
          clearable
          style="width: 240px"
          @keyup.enter="getList"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone_num">
        <el-input
          v-model="queryParams.phone_num"
          placeholder="请输入手机号码"
          clearable
          style="width: 240px"
          @keyup.enter="getList"
        />
      </el-form-item>
      <el-form-item label="状态" prop="user_status">
        <el-select
          v-model="queryParams.user_status"
          placeholder="用户状态"
          clearable
          style="width: 240px"
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
          style="width: 240px"
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
        <el-button :icon="Refresh" @click="resetQuery"> 重置 </el-button>
      </el-form-item>
    </el-form>
    <!-- 操作区域 -->
    <el-row :gutter="10" class="m-b-8px" style="height: 35px">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          :icon="Plus"
          @click="handleAdd"
          v-if="hasPermission(ApiSysUser.add)"
        >
          新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          :icon="Edit"
          :disabled="!single"
          @click="handleUpdate"
          v-if="hasPermission(ApiSysUser.edit)"
        >
          修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          :icon="Delete"
          :disabled="!selected"
          @click="handleDelete"
          v-if="hasPermission(ApiSysUser.delete)"
        >
          删除
        </el-button>
      </el-col>
      <RightToolBar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>
    <!-- 表格区域 -->
    <el-table
      :data="userList"
      @selection-change="handleSelectionChange"
      tooltip-effect="light"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column
        key="id"
        label="用户编号"
        align="center"
        prop="id"
        width="100"
        show-overflow-tooltip
      />
      <el-table-column
        key="user_name"
        label="用户名称"
        align="center"
        prop="user_name"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        key="user_nickname"
        label="用户昵称"
        align="center"
        prop="user_nickname"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        key="dept_id"
        label="部门"
        align="center"
        prop="dept.dept_name"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        key="phone_num"
        label="手机号码"
        align="center"
        prop="phone_num"
        width="120"
      />
      <el-table-column key="user_status" label="状态" align="center">
        <template #default="scope">
          <el-switch
            v-model="scope.row.user_status"
            active-value="1"
            inactive-value="0"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="created_at"
        width="170"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.created_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template #default="scope">
          <el-tooltip content="修改" placement="top" effect="light">
            <el-button
              v-if="scope.row.userId !== 1"
              link
              :icon="Edit"
              @click="handleUpdate(scope.row)"
            />
          </el-tooltip>
          <el-tooltip content="删除" placement="top" effect="light">
            <el-button
              v-if="scope.row.userId !== 1"
              link
              :icon="Delete"
              @click="handleDelete(scope.row)"
            />
          </el-tooltip>
          <el-tooltip content="重置密码" placement="top" effect="light">
            <el-button
              v-if="scope.row.userId !== 1"
              link
              :icon="Key"
              @click="handleResetPwd(scope.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      v-model:page="queryParams.page_num"
      v-model:limit="queryParams.page_size"
      :total="total"
      @pagination="getList"
    />
    <!-- 用户新增，编辑对话框 -->
    <UserManageDialog
      v-if="open"
      :user-id="propsUserId"
      :title="title"
      :open="open"
      @close-dialog="closeDialog"
    />
  </div>
</template>
<script lang="ts" setup name="user-manage-form">
import {
  Delete,
  Edit,
  Key,
  Plus,
  Refresh,
  Search,
} from '@element-plus/icons-vue'
import md5 from 'blueimp-md5'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, watch } from 'vue'

import { ApiSysUser } from '@/api/apis'
import {
  hasPermission,
  parseTime,
  useDeleteFn,
  useDicts,
  useListData,
  usePut,
  useTableUtil,
} from '@/hooks'
import type { deptQueryParam } from '@/types/system/dept'
import { dictKey } from '@/types/system/dict'
import type { resetUserPwd, user, userQueryParam } from '@/types/system/user'

import UserManageDialog from './user-manage-dialog.vue'

const props = defineProps({
  dept_id: {
    type: String,
  },
})
const open = ref(false)
const title = ref('')
const propsUserId = ref('')

const dicts = useDicts(
  dictKey.sysNormalDisable,
  dictKey.sysUserSex,
  dictKey.isAdmin
)

const showSearch = ref(true)
const dateRange = ref<string[]>([])
const { useTableSelectChange } = useTableUtil()
const { handleSelectionChangeFn, ids, values, single, selected } =
  useTableSelectChange()
const handleSelectionChange = (v: user[]) =>
  handleSelectionChangeFn(v, 'id', 'user_name')

const queryParams = ref<userQueryParam>({
  page_num: 1,
  page_size: 10,
})

const {
  list: userList,
  getListFn: getList,
  total,
} = useListData<deptQueryParam, user>(
  ApiSysUser.getList,
  queryParams,
  dateRange
)

const resetQuery = () => {
  queryParams.value.dept_id = undefined
  getList()
}

// 状态切换
const handleStatusChange = async (row: user) => {
  const text = row.user_status === '1' ? '启用' : '停用'
  await ElMessageBox.confirm(
    `确定要  ${text}  ${row.user_name}  的用户吗?`,
    '切换用户状态',
    { type: 'warning' }
  )
    .then(async () => {
      const { execute } = usePut(ApiSysUser.changeStatus, {
        user_id: row.id,
        status: row.user_status,
      })
      await execute()
      ElMessage.success(`你成功 ${text} 用户 ${row.user_name}`)
      getList()
    })
    .catch(() => {
      ElMessage.info('你取消了操作')
      row.user_status = row.user_status === '0' ? '1' : '0'
    })
}
// 新增
const handleAdd = () => {
  propsUserId.value = ''
  title.value = '新增用户'
  open.value = true
}
// 更新
const handleUpdate = async (row: user) => {
  propsUserId.value = row.id || ids.value[0]
  title.value = `修改用户 - ${row.user_name}`
  open.value = true
}
// 删除
const handleDelete = async (row: user) => {
  const flag = await useDeleteFn(
    ApiSysUser.delete,
    'id',
    ids,
    'user_name',
    values,
    'user_ids',
    row
  )
  if (flag) getList()
}

const handleResetPwd = (row: user) => {
  ElMessageBox.prompt(`请输入 ${row.user_name} 的新密码`, '重置密码', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputPattern: /^.{5,32}$/,
    inputErrorMessage: '用户密码长度必须介于 5 和 32 之间',
  })
    .then(async ({ value }) => {
      const data: resetUserPwd = {
        user_id: row.id!,
        new_passwd: md5(value),
      }
      const { execute } = usePut(ApiSysUser.resetPwd, data)
      await execute()
      ElMessage.success(`用户 ${row.user_name} 的密码成功重置为 ${value}`)
    })
    .catch(() => {
      ElMessage.info('你取消了操作')
    })
}

const closeDialog = () => {
  open.value = false
  getList()
}
// 监控props
watch(
  () => props.dept_id,
  (v) => {
    queryParams.value.dept_id = v
    getList()
  }
)
//
</script>
