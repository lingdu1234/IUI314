<script lang="ts" setup>
import { type PropType, computed, markRaw, ref, watch } from 'vue'

import { IconDelete, IconEdit, IconPlus } from '@arco-design/web-vue/es/icon'
import { useI18n } from 'vue-i18n'
import { ApiSysDictType, ApiSysUser } from '@/api/apis'
import Pagination from '@/components/common/pagination.vue'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import {
  hasPermission,
  type listType,
  useDeleteFn,
  useDicts,
  useGet,
  useTableUtil,
} from '@/hooks'
import IuQueryForm from '@/components/iui/iu-query-form.vue'
import IuButton from '@/components/iui/iu-button.vue'
import UserManageModal from '@/views/system/auth/pages/user/user-manage-modal.vue'
import type { dept } from '@/types/system/dept'
import type { userInformation, userQueryParam } from '@/types/system/userInformation'
import { FormItemType, type IuQueryFormField } from '@/types/base/iu-form'
import { dictKey } from '@/types/system/dict'
import type { MessageSchema } from '@/i18n'
import UserManageTable from '@/views/system/auth/pages/user/user-manage-table.vue'

// 导出名称
defineOptions({
  name: 'UserManageForm',
})
const props = defineProps({
  deptId: {
    type: String,
  },
  deptTree: {
    type: Array as PropType<dept[]>,
    required: true,
  },
})

const showSearch = ref(true)
const modalRef = ref<InstanceType<typeof UserManageModal>>()
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })

const dicts = useDicts(
  dictKey.sysNormalDisable,
  dictKey.sysUserSex,
  dictKey.isAdmin,
)

const { useTableSelectChange } = useTableUtil()
const { handleSelectionChangeFnX, ids, values, single, selected }
    = useTableSelectChange()

const queryParams = ref<userQueryParam>({
  page_num: 1,
  page_size: 10,
})

const {
  isFetching: isLoading,
  data: dataList,
  execute: getList,
} = useGet<listType<userInformation>>(
  ApiSysUser.getList,
  queryParams,
  { immediate: true },
)

const handAdd = () => modalRef.value?.handleAdd()
const handleUpdate = (row?: userInformation) => modalRef.value?.handleUpdate(row)

const operateButtons = ref<{ [key: string]: any }[]>([
  {
    label: t('common.add'),
    icon: markRaw(IconPlus),
    auth: computed(() => hasPermission(ApiSysDictType.add)),
    disabled: false,
    fn: handAdd,
    buttonType: 'primary',
    buttonStatus: 'normal',
  },
  {
    label: t('common.edit'),
    icon: markRaw(IconEdit),
    auth: computed(() => hasPermission(ApiSysDictType.edit)),
    disabled: computed(() => !single.value),
    fn: handleUpdate,
    buttonType: 'primary',
    buttonStatus: 'warning',
  },
  {
    label: t('common.delete'),
    icon: markRaw(IconDelete),
    auth: computed(() => hasPermission(ApiSysDictType.delete)),
    disabled: computed(() => !selected.value),
    fn: handleDelete,
    buttonType: 'primary',
    buttonStatus: 'danger',
  },
])

const queryFormItems = ref<IuQueryFormField[]>([
  {
    field: 'user_name',
    label: '用户名称',
    type: FormItemType.input,
    placeholder: '请输入用户名称',
  },
  {
    field: 'phone_num',
    label: '电话号码',
    type: FormItemType.input,
    placeholder: '请输入电话号码',
  },
  {
    field: 'user_status',
    label: '用户状态',
    type: FormItemType.select,
    placeholder: '请输入用户状态',
    selectOption: {
      dataOption: computed(() => dicts.value[dictKey.sysNormalDisable]),
      dataOptionKey: {
        label: 'label',
        value: 'value',
      },
      allowClear: true,
      allowSearch: true,
    },
  },
  {
    field: 'begin_time',
    label: '开始日期',
    type: FormItemType.datePicker,
    placeholder: '请输入开始日期',
  },
  {
    field: 'end_time',
    label: '结束日期',
    type: FormItemType.datePicker,
    placeholder: '请输入结束日期',
  },
])

async function handleDelete(row?: userInformation) {
  await useDeleteFn(
    ApiSysDictType.delete,
    'id',
    ids,
    'user_name',
    values,
    'use_ids',
    row,
    getList,
  )
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

    <UserManageTable
      :is-loading="isLoading"
      :dicts="dicts"
      :table-data="dataList && dataList?.list"
      @handle-delete="handleDelete"
      @handle-update="handleUpdate"
      @handle-selection-change-fn="handleSelectionChangeFnX"
    />
    <Pagination
      v-show="dataList?.total && dataList.total > 0"
      v-model:limit="queryParams.page_size"
      v-model:page="queryParams.page_num"
      :total="dataList?.total"
      @pagination="getList"
    />
    <UserManageModal
      v-if="deptTree"
      ref="modalRef"
      :ids="ids"
      :dept-tree="deptTree"
      :dicts="dicts"
      @get-list="getList"
    />
  </div>
</template>
