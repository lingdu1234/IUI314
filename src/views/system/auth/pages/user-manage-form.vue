<script lang="ts" setup>
import { type PropType, computed, h, markRaw, ref, watch } from 'vue'

import { Message, Modal, type TableColumnData, type TableRowSelection } from '@arco-design/web-vue'
import { IconDelete, IconEdit, IconPlus } from '@arco-design/web-vue/es/icon'
import md5 from 'blueimp-md5'
import { useI18n } from 'vue-i18n'
import { ApiSysDictType, ApiSysUser, ErrorFlag } from '@/api/apis'
import Pagination from '@/components/common/pagination.vue'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import {
  hasPermission,
  type listType,
  parseTime,
  useDeleteFn,
  useDicts,
  useGet,
  usePut,
  useTableUtil,
} from '@/hooks'
import IuQueryForm from '@/components/iui/iu-query-form.vue'
import IuButton from '@/components/iui/iu-button.vue'
import UserManageModal from '@/views/system/auth/pages/user-manage-modal.vue'
import type { dept } from '@/types/system/dept'
import type { resetUserPwd, userInformation, userQueryParam } from '@/types/system/userInformation'
import { FormItemType, type IuQueryFormField } from '@/types/base/iu-form'
import { dictKey, type dictType } from '@/types/system/dict'
import ResetPwd from '@/views/system/auth/pages/resetPwd.vue'
import DictTag from '@/components/common/dict-tag.vue'
import type { MessageSchema } from '@/i18n'

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

function handleSelectionChange(keys: (string | number)[]) {
  return handleSelectionChangeFnX(keys, dataList.value?.list, 'id', 'user_name')
}
const handAdd = () => modalRef.value?.handleAdd()
const handleUpdate = () => modalRef.value?.handleUpdate()

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

const rowSelection = ref<TableRowSelection>({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
})

// 表格列属性
const columns: TableColumnData[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    ellipsis: true,
    tooltip: true,
    width: 200,
    align: 'center',
  },
  {
    title: t('profile.name'),
    dataIndex: 'user_name',
    align: 'center',
    width: 100,
  },
  {
    title: t('profile.nickName'),
    dataIndex: 'user_nickname',
    align: 'center',
    width: 150,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: t('user.dept'),
    dataIndex: 'dept.dept_name',
    align: 'center',
    width: 100,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '手机号码',
    dataIndex: 'phone_num',
    align: 'center',
    width: 100,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '状态',
    width: 100,
    align: 'center',
    render: ({ record }) => h(DictTag, {
      options: dicts.value[dictKey.sysNormalDisable],
      value: record.user_status,
    }),
  },
  {
    title: '创建时间',
    width: 180,
    align: 'center',
    render: ({ record }) => parseTime(record.created_at),
  },
  {
    title: '操作',
    slotName: 'operation',
    width: 150,
    fixed: 'right',
    align: 'center',
  },
]
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

// 密码重置
const resetPwd = ref({
  password: '',
})
function handleResetPwd(row: userInformation) {
  resetPwd.value.password = ''
  Modal.warning({
    title: '密码重置',
    hideCancel: false,
    titleAlign: 'start',
    content: () => h(ResetPwd, { formValue: resetPwd.value }),
    footer: true,
    draggable: true,
    onOk: async () => {
      const data: resetUserPwd = {
        user_id: row.id!,
        new_passwd: md5(resetPwd.value.password),
      }
      const { data: dataRes, execute } = usePut(ApiSysUser.resetPwd, data)
      await execute()
      if (dataRes.value === ErrorFlag)
        return
      Message.success(`用户 ${row.user_name} 的密码成功重置为 ${resetPwd.value.password}`)
    },
    onCancel() {
      Message.info(`你取消了重置用户 ${row.user_name} 的密码操作！`)
    },
  })
}

async function handleDelete(row?: dictType) {
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
          @click="modalRef?.handleUpdate(record)"
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
    <UserManageModal
      v-if="deptTree"
      ref="modalRef"
      :ids="ids"
      :dept-tree="deptTree"
      :dicts="dicts"
      @get-list="getList"
    />
    <!--    <IuModal -->
    <!--      v-model:visible="open" -->
    <!--      v-model:form-value="form" -->
    <!--      :form-items="modalFormItems" -->
    <!--      :icon="modalIcon" -->
    <!--      :title="title" -->
    <!--      :item-width="250" -->
    <!--      :default-col="2" -->
    <!--      @handle-ok="submitForm" -->
    <!--    /> -->
  </div>
</template>
