<script lang="ts" setup>
import { markRaw, ref, watch } from 'vue'

import { Message, type TableRowSelection } from '@arco-design/web-vue'
import { IconDelete, IconEdit, IconPlus } from '@arco-design/web-vue/es/icon'
import { useI18n } from 'vue-i18n'
import { ApiSysDictType, ApiSysUser, ErrorFlag } from '@/api/apis'
import Pagination from '@/components/common/pagination.vue'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import {
  hasPermission,
  useGet,
  usePost,
  usePut,
} from '@/hooks'
import { DictDataRouteName, router } from '@/router'
import type { dictType } from '@/types/system/dict'
import IuQueryForm from '@/components/iui/iu-query-form.vue'
import IuButton from '@/components/iui/iu-button.vue'
import IuModal from '@/components/iui/iu-modal.vue'
import type { MessageSchema } from '@/i18n'
import { useUserForm } from '@/views/system/auth/hooks/useUserForm'

// 导出名称
defineOptions({
  name: 'UserManageForm',
})
const props = defineProps({
  deptId: {
    type: String,
  },
})
const showSearch = ref(true)
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })

const {
  queryParams,
  isLoading,
  dataList,
  getList,
  queryFormItems,
  editFormItems,
  columns,
  operateButtons,
  handleSelectionChangeFnX,
  handleDelete,
  handleResetPwd,
} = useUserForm()

//
const modalIcon = ref()
const open = ref(false)
const title = ref('')
const form = ref<dictType>({
  dict_name: '',
  dict_type: '',
  dict_type_id: undefined,
  remark: '',
  status: '1',
})

const rowSelection = ref<TableRowSelection>({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
})

function handleSelectionChange(keys: (string | number)[]) {
  return handleSelectionChangeFnX(keys, dataList.value?.list, 'id', 'user_name')
}

function handleAdd() {
  modalIcon.value = markRaw(IconPlus)
  open.value = true
  form.value.dict_type_id = undefined
  title.value = t('common.add') + t('dict.type')
}
async function handleUpdate(row?: dictType) {
  modalIcon.value = markRaw(IconEdit)
  open.value = true
  const dict_type_id = row?.dict_type_id || ids.value[0]
  const { data, execute } = useGet(ApiSysDictType.getById, { dict_type_id })
  await execute()
  form.value = data.value as dictType
  title.value = t('common.update') + t('dict.type')
}

async function submitForm() {
  if (form.value.dict_type_id !== undefined) {
    const { execute, data } = usePut(ApiSysDictType.edit, form)

    await execute()
    if (data.value === ErrorFlag)
      return
    Message.success(t('commonTip.updateSuccess'))
  }
  else {
    const { execute, data } = usePost(ApiSysDictType.add, form)
    await execute()
    if (data.value === ErrorFlag)
      return
    Message.success(t('commonTip.addSuccess'))
  }
  open.value = false
  await getList()
}

// 删除数据

function goto_data(row: dictType) {
  router.push({
    name: DictDataRouteName,
    query: { dict: row.dict_type_id, dict_type: row.dict_type },
  })
}
watch(
  () => props.deptId,
  (v) => {
    queryParams.value.dept_id = v
    getList()
  },
)
</script>

<template>
  <div>
    <IuQueryForm
      v-show="showSearch"
      v-model:form-value="queryParams"
      v-model:form-items="queryFormItems"
      @query="getList"
    />
    <!-- 操作区域 -->
    <a-row :gutter="10" class="m-b-8px">
      <a-col v-for="(item, index) in operateButtons" :key="index" :span="1.5">
        <IuButton
          :auth="item.auth"
          :label="item.label"
          :icon="item.icon"
          :disabled="item.disabled"
          :type="item.buttonType"
          :status="item.buttonStatus"
          :fn="item.fn"
        />
      </a-col>
      <RightToolBar v-model:showSearch="showSearch" @query-table="getList" />
    </a-row>

    <a-table
      :columns="columns"
      :data="dataList?.list"
      :row-selection="rowSelection"
      :loading="isLoading"
      row-key="id"
      :scroll="{ minWidth: 800 }"
      :pagination="false"
      @selection-change="handleSelectionChange"
    >
      <template #operation="{ record }">
        <a-button
          v-if="hasPermission(ApiSysUser.edit)"
          type="text"
          shape="round"
          @click="handleUpdate(record)"
        >
          <template #icon>
            <IconEdit />
          </template>
        </a-button>
        <a-button
          v-if="hasPermission(ApiSysUser.delete)"
          type="text"
          shape="round"
          status="danger"
          @click="handleDelete(record)"
        >
          <template #icon>
            <IconDelete />
          </template>
        </a-button>
        <a-button
          v-if="hasPermission(ApiSysUser.resetPwd)"
          type="text"
          shape="round"
          status="danger"
          @click="handleResetPwd(record)"
        >
          <template #icon>
            <IconTool />
          </template>
        </a-button>
      </template>
    </a-table>
    <Pagination
      v-show="dataList?.total && dataList.total > 0"
      v-model:limit="queryParams.page_size"
      v-model:page="queryParams.page_num"
      :total="dataList?.total"
      @pagination="getList"
    />
    <IuModal
      v-model:visible="open"
      v-model:form-value="form"
      :form-items="editFormItems"
      :icon="modalIcon"
      :title="title"
      @handle-ok="submitForm"
    />
  </div>
</template>
