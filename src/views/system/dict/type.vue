<script lang="ts" setup>
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import {
  type DateModelType,
  ElButton,
  ElCol,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElLink,
  ElMessage,
  ElRadio,
  ElRadioGroup,
  ElRow,
  ElTable,
  ElTableColumn,
  type FormInstance,
  type FormRules,
} from 'element-plus'
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { ApiSysDictType, ErrorFlag } from '@/api/apis'
import DictTag from '@/components/common/dict-tag.vue'
import Pagination from '@/components/common/pagination.vue'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import {
  addTimeQueryParam,
  hasPermission,
  type listType,
  parseTime,
  useDeleteFn,
  useDicts,
  useFormUtil,
  useGet,
  usePost,
  usePut,
  useTableUtil,
} from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { DictDataRouteName, router, systemMenus } from '@/router'
import { dictKey, type dictType, type dictTypeQueryParam } from '@/types/system/dict'
import IuQueryForm from '@/components/common/iu-query-form.vue'
import { FormItemType, type IuQueryFormField } from '@/types/base/iu-form'

// 导出名称
defineOptions({
  name: systemMenus.dict.path,
})

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const queryRef = ref<FormInstance>()
const dictRef = ref<FormInstance>()
const showSearch = ref(true)
//  字典数据
const dicts = useDicts(dictKey.sysNormalDisable)
const { formValidate, formReset } = useFormUtil()
const { useTableSelectChange } = useTableUtil()
const { handleSelectionChangeFn, ids, values, single, selected }
  = useTableSelectChange()

function handleSelectionChange(v: dictType[]) {
  return handleSelectionChangeFn(v, 'dict_type_id', 'dict_name')
}

const queryParams = ref<dictTypeQueryParam>({
  page_num: 1,
  page_size: 10,
})
const dateRange = ref<[DateModelType, DateModelType]>()
const formItems = ref<IuQueryFormField[]>([
  {
    field: 'dict_name',
    label: '字典名称',
    type: FormItemType.input,
    placeholder: '请输入字典名称',
  },
  {
    field: 'dict_type',
    label: '字典类型',
    type: FormItemType.input,
    placeholder: '请输入字典类型',
  },
  {
    field: 'status',
    label: '字典状态',
    type: FormItemType.select,
    placeholder: '请输入字典状态',
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
const open = ref(false)
const form = ref<dictType>({
  dict_name: '',
  dict_type: '',
  dict_type_id: undefined,
  remark: '',
  status: '1',
})
const title = ref('')
const rowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
})

const columns = [
  {
    title: '字典Id',
    dataIndex: 'dict_type_id',
  },
  {
    title: '字典名称',
    dataIndex: 'dict_name',
  },
  {
    title: '字典类型',
    slotName: 'dict_type',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '创建时间',
    slotName: 'created_at',
  },
  {
    title: '操作',
    slotName: 'operation',
    width: 200,
    fixed: 'right',
  },
]

const queryParamsAndTime = computed(() => addTimeQueryParam(queryParams.value, dateRange.value))
const {
  isFetching: isLoading,
  data: dataList,
  execute: getList,
} = useGet<listType<dictType>>(
  ApiSysDictType.getList,
  queryParamsAndTime,
  { immediate: true },
)

const rules = ref<FormRules>({
  dict_name: [
    { required: true, message: t('dict_dictNameRuleTip'), trigger: 'blur' },
  ],
  dict_type: [
    { required: true, message: t('dict.dictTypeRuleTip'), trigger: 'blur' },
  ],
})

function resetQuery() {
  formReset(queryRef.value)
  dateRange.value = undefined
  getList()
}

function cancel() {
  open.value = false
  formReset(dictRef.value)
}

function handleAdd() {
  formReset(dictRef.value)
  open.value = true
  form.value.dict_type_id = undefined
  title.value = t('common.add') + t('dict.type')
}
async function handleUpdate(row?: dictType) {
  formReset(dictRef.value)
  open.value = true
  const dict_type_id = row?.dict_type_id || ids.value[0]
  const { data, execute } = useGet(ApiSysDictType.getById, { dict_type_id })
  await execute()
  form.value = data.value as dictType
  title.value = t('common.update') + t('dict.type')
}

// 删除数据
async function handleDelete(row?: dictType) {
  const flag = await useDeleteFn(
    ApiSysDictType.delete,
    'dict_type_id',
    ids,
    'dict_name',
    values,
    'dict_type_ids',
    row,
  )
  if (flag)
    await getList()
}

async function submitForm(formRef: FormInstance | undefined) {
  if (!(await formValidate(formRef)))
    return
  if (form.value.dict_type_id !== undefined) {
    const { execute, data } = usePut(ApiSysDictType.edit, form)

    await execute()
    if (data.value === ErrorFlag)
      return
    ElMessage.success(t('commonTip.updateSuccess'))
  }
  else {
    const { execute, data } = usePost(ApiSysDictType.add, form)
    await execute()
    if (data.value === ErrorFlag)
      return
    ElMessage.success(t('commonTip.addSuccess'))
  }
  open.value = false
  getList()
}

function goto_data(row: dictType) {
  router.push({
    name: DictDataRouteName,
    query: { dict: row.dict_type_id, dict_type: row.dict_type },
  })
}
</script>

<template>
  <div>
    <IuQueryForm
      v-show="showSearch"
      v-model:form-value="queryParams"
      v-model:form-items="formItems"
      @query="getList"
    />
    <!-- 操作区域 -->
    <ElRow :gutter="10" class="m-b-8px">
      <ElCol :span="1.5">
        <ElButton
          v-if="hasPermission(ApiSysDictType.add)"
          :icon="Plus"
          plain
          type="primary"
          @click="handleAdd"
        >
          {{ t('common.add') }}
        </ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton
          v-if="hasPermission(ApiSysDictType.edit)"
          :disabled="!single"
          :icon="Edit"
          plain
          type="success"
          @click="handleUpdate()"
        >
          {{ t('common.edit') }}
        </ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton
          v-if="hasPermission(ApiSysDictType.delete)"
          :disabled="!selected"
          :icon="Delete"
          plain
          type="danger"
          @click="handleDelete()"
        >
          {{ t('common.delete') }}
        </ElButton>
      </ElCol>
      <RightToolBar v-model:showSearch="showSearch" @query-table="getList" />
    </ElRow>

    <a-table
      :columns="columns"
      :data="dataList?.list"
      :row-selection="rowSelection"
      row-key="dict_type_id"
      :scroll="{ minWidth: 800 }"
      :pagination="false"
    >
      <template #dict_type="{ record }">
        <a-link type="primary" @click="goto_data(record)">
          {{ record.dict_type }}
        </a-link>
      </template>
      <template #created_at="{ record }">
        <span>{{ parseTime(record.created_at) }}</span>
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
            <icon-edit />
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
            <icon-delete />
          </template>
        </a-button>
      </template>
    </a-table>

    <!-- 表格区域 -->
    <ElTable
      :data="dataList?.list"
      tooltip-effect="light"
      @selection-change="handleSelectionChange"
    >
      <ElTableColumn align="center" type="selection" width="55" />
      <ElTableColumn
        :label="t('dict.typeId')"
        align="center"
        prop="dict_type_id"
        show-overflow-tooltip
        width="100"
      />
      <ElTableColumn
        :label="t('dict.typeName')"
        :show-overflow-tooltip="true"
        align="center"
        prop="dict_name"
      />
      <ElTableColumn
        :label="t('dict.type')"
        :show-overflow-tooltip="true"
        align="center"
      >
        <template #default="scope">
          <ElLink type="primary" @click="goto_data(scope.row)">
            {{ scope.row.dict_type }}
          </ElLink>
        </template>
      </ElTableColumn>
      <ElTableColumn :label="t('common.status')" align="center" prop="status">
        <template #default="scope">
          <DictTag
            :options="dicts[dictKey.sysNormalDisable]"
            :value="scope.row.status"
          />
        </template>
      </ElTableColumn>
      <ElTableColumn
        :label="t('common.remark')"
        :show-overflow-tooltip="true"
        align="center"
        prop="remark"
      />
      <ElTableColumn
        :label="t('common.createTime')"
        align="center"
        prop="created_at"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.created_at) }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn
        :label="t('common.operation')"
        align="center"
        width="160"
      >
        <template #default="scope">
          <ElButton
            v-if="hasPermission(ApiSysDictType.edit)"
            :icon="Edit"
            link
            @click="handleUpdate(scope.row)"
          >
            {{ t('common.edit') }}
          </ElButton>
          <ElButton
            v-if="hasPermission(ApiSysDictType.delete)"
            :icon="Delete"
            link
            type="danger"
            @click="handleDelete(scope.row)"
          >
            {{ t('common.delete') }}
          </ElButton>
        </template>
      </ElTableColumn>
    </ElTable>
    <Pagination
      v-show="dataList?.total && dataList.total > 0"
      v-model:limit="queryParams.page_size"
      v-model:page="queryParams.page_num"
      :total="dataList?.total"
      @pagination="getList"
    />
    <!-- 添加对话框 -->
    <ElDialog
      v-if="open"
      v-model="open"
      :title="title"
      append-to-body
      width="500px"
    >
      <ElForm
        ref="dictRef"
        :model="form"
        :rules="rules"
        class="base-form"
        label-width="80px"
      >
        <ElFormItem :label="t('dict.typeName')" prop="dict_name">
          <ElInput v-model="form.dict_name" :placeholder="t('dict.nameTip')" />
        </ElFormItem>
        <ElFormItem :label="t('dict.type')" prop="dict_type">
          <ElInput
            v-model="form.dict_type"
            :placeholder="t('dict.dictTypeTip')"
          />
        </ElFormItem>
        <ElFormItem :label="t('common.status')" prop="status">
          <ElRadioGroup v-model="form.status">
            <ElRadio
              v-for="dict in dicts[dictKey.sysNormalDisable]"
              :key="dict.value"
              :label="dict.value"
            >
              {{ dict.label }}
            </ElRadio>
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem :label="t('common.remark')" prop="remark">
          <ElInput
            v-model="form.remark"
            :placeholder="t('common.remarkTip')"
            type="textarea"
          />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <div class="dialog-footer">
          <ElButton type="primary" @click="submitForm(dictRef)">
            {{ t('common.submit') }}
          </ElButton>
          <ElButton @click="cancel">
            {{ t('common.cancel') }}
          </ElButton>
        </div>
      </template>
    </ElDialog>
  </div>
</template>
