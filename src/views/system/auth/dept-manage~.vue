<script lang="ts" setup>
import {
  Delete,
  Edit,
  Plus,
  Refresh,
  Search,
  Sort,
} from '@element-plus/icons-vue'
import {
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
  type FormInstance,
} from 'element-plus'
import { nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import DeptManageDialog from './pages/dept-manage-dialog.vue'
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

// 组件名称
defineOptions({
  name: systemMenus.deptManage.path,
})
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

async function getList() {
  const { data, execute } = useGet<dept[]>(ApiSysDept.getDeptTree)
  await execute()
  deptTree.value = data.value!
}
function toggleExpandAll() {
  isExpandAll.value = !isExpandAll.value
  refreshTable.value = false
  nextTick(() => {
    refreshTable.value = true
  })
}
function handleAdd(row?: dept) {
  if (row?.dept_id) {
    deptData.value.parent_id = row.dept_id
  }
  else {
    deptData.value = {
      status: '1',
    }
  }
  title.value = t('dept.add')
  open.value = true
}
function handleUpdate(row: dept) {
  deptData.value = row
  title.value = `${t('dept.update')}-${row.dept_name}`
  open.value = true
}
function handleDelete(row: dept) {
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

function closeDialog() {
  open.value = false
  getList()
}
function resetQuery() {
  formReset(queryRef.value)
  getList()
}
getList()
</script>

<template>
  <div>
    <ElForm
      v-show="showSearch"
      ref="queryRef"
      :inline="true"
      :model="queryParams"
      class="base-form"
    >
      <ElFormItem :label="t('dept.name')" prop="dept_name">
        <ElInput
          v-model="queryParams.dept_name"
          :placeholder="t('dept.name')"
          clearable
          @keyup.enter="getList"
        />
      </ElFormItem>
      <ElFormItem :label="t('dept.status')" prop="status">
        <ElSelect
          v-model="queryParams.status"
          :placeholder="t('dept.status')"
          clearable
        >
          <ElOption
            v-for="dict in dicts[dictKey.sysNormalDisable]"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem>
        <ElButton :icon="Search" type="primary" @click="getList">
          {{ t('common.search') }}
        </ElButton>
        <ElButton :icon="Refresh" @click="resetQuery">
          {{ t('common.reset') }}
        </ElButton>
      </ElFormItem>
    </ElForm>
    <!-- 操作区域 -->
    <ElRow :gutter="10" class="m-b-8px">
      <ElCol :span="1.5">
        <ElButton
          v-if="hasPermission(ApiSysDept.add)"
          :icon="Plus"
          plain
          type="primary"
          @click="handleAdd()"
        >
          {{ t('common.add') }}
        </ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton :icon="Sort" plain type="info" @click="toggleExpandAll">
          {{ `${t('common.expand')}/${t('common.collapse')}` }}
        </ElButton>
      </ElCol>
      <RightToolBar v-model:showSearch="showSearch" @query-table="getList" />
    </ElRow>
    <!-- 表格区域 -->
    <ElTable
      v-if="refreshTable"
      :data="deptTree"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      row-key="dept_id"
      tooltip-effect="light"
    >
      <ElTableColumn :label="t('dept.name')" prop="dept_name" width="260" />
      <ElTableColumn
        :label="t('common.order')"
        prop="order_num"
        show-overflow-tooltip
      />
      <ElTableColumn
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
        v-if="hasPermission(ApiSysDept.add, ApiSysUser.edit, ApiSysDept.delete)"
        :label="t('common.operation')"
        align="center"
        width="220px"
      >
        <template #default="scope">
          <ElButton
            v-if="hasPermission(ApiSysDept.edit)"
            :icon="Edit"
            link
            @click="handleUpdate(scope.row)"
          >
            {{ t('common.edit') }}
          </ElButton>
          <ElButton
            v-if="hasPermission(ApiSysDept.add)"
            :icon="Plus"
            link
            @click="handleAdd(scope.row)"
          >
            {{ t('common.add') }}
          </ElButton>
          <ElButton
            v-if="
              hasPermission(ApiSysDept.delete) && scope.row.parent_id !== '0'
            "
            :icon="Delete"
            link
            @click="handleDelete(scope.row)"
          >
            {{ t('common.delete') }}
          </ElButton>
        </template>
      </ElTableColumn>
    </ElTable>
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
