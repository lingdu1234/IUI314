<script lang="ts" setup>
import { computed, markRaw, ref } from 'vue'

import { Message, type TableRowSelection } from '@arco-design/web-vue'
import { IconDelete, IconEdit, IconPlus } from '@arco-design/web-vue/es/icon'
import { useI18n } from 'vue-i18n'
import { ApiSysDictType, ApiSysLoginLog, ErrorFlag } from '@/api/apis'
import Pagination from '@/components/common/pagination.vue'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import {
  hasPermission,
  type listType,
  parseTime,
  useDeleteFn,
  useGet,
  usePost,
  usePut,
  useTableUtil,
} from '@/hooks'
import { systemMenus } from '@/router'
import { dictKey, type dictType } from '@/types/system/dict'
import IuQueryForm from '@/components/iui/iu-query-form.vue'
import IuButton from '@/components/iui/iu-button.vue'
import IuModal from '@/components/iui/iu-modal.vue'
import type { MessageSchema } from '@/i18n'
import type { loginLog, loginLogQueryParam } from '@/types/system/login-log'
import { useLoginLog } from '@/views/system/monitor/hooks/useLoginLog'
import DictTag from '@/components/common/dict-tag.vue'

// 导出名称
defineOptions({
  name: systemMenus.loginLog.path,
})

const showSearch = ref(true)
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const { useTableSelectChange } = useTableUtil()
const { handleSelectionChangeFnX, ids, values, single, selected }
    = useTableSelectChange()

const {
  dicts,
  queryFormItems,
  editFormItems,
  columns,
} = useLoginLog()
const queryParams = ref<loginLogQueryParam>({
  page_num: 1,
  page_size: 10,
})

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
const {
  isFetching: isLoading,
  data: dataList,
  execute: getList,
} = useGet<listType<loginLog>>(
  ApiSysLoginLog.getList,
  queryParams,
  { immediate: true },
)

const operateButtons = ref<{ [key: string]: any }[]>([
  {
    label: t('common.delete'),
    icon: markRaw(IconDelete),
    auth: computed(() => hasPermission(ApiSysLoginLog.delete)),
    disabled: computed(() => !single.value),
    fn: handleDelete,
    buttonType: 'primary',
    buttonStatus: 'warning',
  },
  {
    label: t('common.clean'),
    icon: markRaw(IconDelete),
    auth: computed(() => hasPermission(ApiSysLoginLog.clean)),
    disabled: false,
    fn: handleDelete,
    buttonType: 'primary',
    buttonStatus: 'danger',
  },
])

const rowSelection = ref<TableRowSelection>({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
})

function handleSelectionChange(keys: string[]) {
  return handleSelectionChangeFnX(keys, dataList.value?.list, 'info_id', 'info_id')
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
async function handleDelete(row?: dictType) {
  await useDeleteFn(
    ApiSysLoginLog.delete,
    'info_id',
    ids,
    'info_id',
    values,
    'info_id',
    row,
    getList,
  )
}
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
      row-key="info_id"
      :scroll="{ minWidth: 800 }"
      :pagination="false"
      @selection-change="handleSelectionChange"
    >
      <template #status="{ record }">
        <DictTag
          :options="dicts[dictKey.sysCommonStatus]"
          :value="record.status"
        />
      </template>
      <template #loginTime="{ record }">
        <span>{{ parseTime(record.login_time) }}</span>
      </template>
      <template #operation="{ record }">
        <a-button
          v-if="hasPermission(ApiSysDictType.edit)"
          type="text"
          shape="round"
          @click="handleUpdate(record)"
        >
          {{ t('common.edit') }}
          <template #icon>
            <IconEdit />
          </template>
        </a-button>
        <a-button
          v-if="hasPermission(ApiSysDictType.delete)"
          type="text"
          shape="round"
          status="danger"
          @click="handleDelete(record)"
        >
          {{ t('common.delete') }}
          <template #icon>
            <IconDelete />
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
