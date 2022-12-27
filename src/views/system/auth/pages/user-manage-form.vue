<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-15 18:47:35
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\views\system\auth\pages\user-manage-form.vue
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
      label-width="80px"
    >
      <el-form-item :label="t('user.name')" prop="user_name">
        <el-input
          v-model="queryParams.user_name"
          :placeholder="t('user.nameTip')"
          clearable
          @keyup.enter="getList"
        />
      </el-form-item>
      <el-form-item :label="t('common.phoneNum')" prop="phone_num">
        <el-input
          v-model="queryParams.phone_num"
          :placeholder="t('common.phoneNum')"
          clearable
          @keyup.enter="getList"
        />
      </el-form-item>
      <el-form-item :label="t('common.status')" prop="user_status">
        <el-select
          v-model="queryParams.user_status"
          :placeholder="t('common.status')"
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
      <el-form-item :label="t('common.createTime2')">
        <el-date-picker
          v-model="dateRange"
          :end-placeholder="t('common.endTime')"
          :start-placeholder="t('common.beginTime')"
          range-separator="-"
          type="daterange"
          value-format="YYYY-MM-DD"
        />
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
          v-if="hasPermission(ApiSysUser.add)"
          :icon="Plus"
          plain
          type="primary"
          @click="handleAdd"
        >
          {{ t('common.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-if="hasPermission(ApiSysUser.edit)"
          :disabled="!single"
          :icon="Edit"
          plain
          type="success"
          @click="handleUpdate()"
        >
          {{ t('common.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-if="hasPermission(ApiSysUser.delete)"
          :disabled="!selected"
          :icon="Delete"
          plain
          type="danger"
          @click="handleDelete()"
        >
          {{ t('common.delete') }}
        </el-button>
      </el-col>
      <RightToolBar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>
    <!-- 表格区域 -->
    <el-table
      :data="userList"
      tooltip-effect="light"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column
        key="id"
        align="center"
        label="ID"
        prop="id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        key="user_name"
        :label="t('profile.name')"
        :show-overflow-tooltip="true"
        align="center"
        prop="user_name"
      />
      <el-table-column
        key="user_nickname"
        :label="t('profile.nickName')"
        :show-overflow-tooltip="true"
        align="center"
        prop="user_nickname"
      />
      <el-table-column
        key="dept_id"
        :label="t('user.dept')"
        :show-overflow-tooltip="true"
        align="center"
        prop="dept.dept_name"
      />
      <el-table-column
        key="phone_num"
        align="center"
        label="手机号码"
        prop="phone_num"
        width="120"
      />
      <el-table-column
        key="user_status"
        :label="t('common.status')"
        align="center"
      >
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
        :label="t('common.createTime')"
        align="center"
        prop="created_at"
        width="170"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.created_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('common.operation')"
        align="center"
        width="150"
      >
        <template #default="scope">
          <el-tooltip
            v-if="scope.row.userId !== 1"
            :content="t('common.edit')"
            effect="light"
            placement="top"
          >
            <el-button :icon="Edit" link @click="handleUpdate(scope.row)" />
          </el-tooltip>
          <el-tooltip
            v-if="scope.row.userId !== 1"
            :content="t('common.delete')"
            effect="light"
            placement="top"
          >
            <el-button :icon="Delete" link @click="handleDelete(scope.row)" />
          </el-tooltip>
          <el-tooltip
            v-if="scope.row.userId !== 1"
            :content="t('user.restPwd')"
            effect="light"
            placement="top"
          >
            <el-button :icon="Key" link @click="handleResetPwd(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-show="total > 0"
      v-model:limit="queryParams.page_size"
      v-model:page="queryParams.page_num"
      :total="total"
      @pagination="getList"
    />
    <!-- 用户新增，编辑对话框 -->
    <UserManageDialog
      v-if="open"
      :open="open"
      :title="title"
      :user-id="propsUserId"
      @close-dialog="closeDialog"
    />
  </div>
</template>
<script lang="ts" setup>
import {
  Delete,
  Edit,
  Key,
  Plus,
  Refresh,
  Search,
} from '@element-plus/icons-vue'
import md5 from 'blueimp-md5'
import {
  type DateModelType,
  ElButton,
  ElCol,
  ElDatePicker,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElMessageBox,
  ElOption,
  ElRow,
  ElSelect,
  ElSwitch,
  ElTable,
  ElTableColumn,
  ElTooltip,
} from 'element-plus'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { ApiSysUser, ErrorFlag } from '@/api/apis'
import Pagination from '@/components/common/pagination.vue'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import {
  hasPermission,
  parseTime,
  useDeleteFn,
  useDicts,
  useListData,
  usePut,
  useTableUtil,
} from '@/hooks'
import type { MessageSchema } from '@/i18n'
import type { deptQueryParam } from '@/types/system/dept'
import { dictKey } from '@/types/system/dict'
import type { resetUserPwd, user, userQueryParam } from '@/types/system/user'

import UserManageDialog from './user-manage-dialog.vue'

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
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
const dateRange = ref<[DateModelType, DateModelType]>()
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
  dateRange.value = undefined
  getList()
}

// 状态切换
const handleStatusChange = async (row: user) => {
  const text = row.user_status === '1' ? '启用' : '停用'
  await ElMessageBox.confirm(
    `确定要  ${text}  ${row.user_name}  吗?`,
    '切换用户状态',
    { type: 'warning' }
  )
    .then(async () => {
      const { data: dataRes, execute } = usePut(ApiSysUser.changeStatus, {
        user_id: row.id,
        status: row.user_status,
      })
      await execute()
      if (dataRes.value === ErrorFlag) return
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
const handleUpdate = async (row?: user) => {
  propsUserId.value = row?.id || ids.value[0]
  title.value = '修改用户'
  open.value = true
}
// 删除
const handleDelete = async (row?: user) => {
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
      const { data: dataRes, execute } = usePut(ApiSysUser.resetPwd, data)
      await execute()
      if (dataRes.value === ErrorFlag) return
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
