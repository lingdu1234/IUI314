<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-03 23:56:33
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\views\system\dict\type.vue
 * @Description: 字典类型数据
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
      <el-form-item :label="t('dict.typeName')" prop="dict_name">
        <el-input
          v-model="queryParams.dict_name"
          :placeholder="t('dict.nameTip')"
          clearable
          @keyup.enter="getList"
        />
      </el-form-item>
      <el-form-item :label="t('dict.type')" prop="dict_type">
        <el-input
          v-model="queryParams.dict_type"
          :placeholder="t('dict.dictTypeTip')"
          clearable
          @keyup.enter="getList"
        />
      </el-form-item>
      <el-form-item :label="t('common.status')" prop="status">
        <el-select
          v-model="queryParams.status"
          :clearable="true"
          :placeholder="t('common.status')"
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
          v-if="hasPermission(ApiSysDictType.add)"
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
          v-if="hasPermission(ApiSysDictType.edit)"
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
          v-if="hasPermission(ApiSysDictType.delete)"
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
      :data="dictTypeList"
      tooltip-effect="light"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column
        :label="t('dict.typeId')"
        align="center"
        prop="dict_type_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        :label="t('dict.typeName')"
        :show-overflow-tooltip="true"
        align="center"
        prop="dict_name"
      />
      <el-table-column
        :label="t('dict.type')"
        :show-overflow-tooltip="true"
        align="center"
      >
        <template #default="scope">
          <el-link type="primary" @click="goto_data(scope.row)">
            {{ scope.row.dict_type }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column :label="t('common.status')" align="center" prop="status">
        <template #default="scope">
          <DictTag
            :options="dicts[dictKey.sysNormalDisable]"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column
        :label="t('common.remark')"
        :show-overflow-tooltip="true"
        align="center"
        prop="remark"
      />
      <el-table-column
        :label="t('common.createTime')"
        align="center"
        prop="created_at"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.created_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('common.operation')"
        align="center"
        width="160"
      >
        <template #default="scope">
          <el-button
            v-if="hasPermission(ApiSysDictType.edit)"
            :icon="Edit"
            link
            @click="handleUpdate(scope.row)"
          >
            {{ t('common.edit') }}
          </el-button>
          <el-button
            v-if="hasPermission(ApiSysDictType.delete)"
            :icon="Delete"
            link
            type="danger"
            @click="handleDelete(scope.row)"
          >
            {{ t('common.delete') }}
          </el-button>
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
    <!-- 添加对话框 -->
    <el-dialog
      v-if="open"
      v-model="open"
      :title="title"
      append-to-body
      width="500px"
    >
      <el-form
        ref="dictRef"
        :model="form"
        :rules="rules"
        class="base-form"
        label-width="80px"
      >
        <el-form-item :label="t('dict.typeName')" prop="dict_name">
          <el-input v-model="form.dict_name" :placeholder="t('dict.nameTip')" />
        </el-form-item>
        <el-form-item :label="t('dict.type')" prop="dict_type">
          <el-input
            v-model="form.dict_type"
            :placeholder="t('dict.dictTypeTip')"
          />
        </el-form-item>
        <el-form-item :label="t('common.status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dicts[dictKey.sysNormalDisable]"
              :key="dict.value"
              :label="dict.value"
            >
              {{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="t('common.remark')" prop="remark">
          <el-input
            v-model="form.remark"
            :placeholder="t('common.remarkTip')"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm(dictRef)">
            {{ t('common.submit') }}
          </el-button>
          <el-button @click="cancel">
            {{ t('common.cancel') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { Delete, Edit, Plus, Refresh, Search } from '@element-plus/icons-vue'
import {
  type DateModelType,
  ElButton,
  ElCol,
  ElDatePicker,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElLink,
  ElMessage,
  ElOption,
  ElRadio,
  ElRadioGroup,
  ElRow,
  ElSelect,
  ElTable,
  ElTableColumn,
  type FormInstance,
  type FormRules,
} from 'element-plus'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { ApiSysDictType, ErrorFlag } from '@/api/apis'
import DictTag from '@/components/common/dict-tag.vue'
import Pagination from '@/components/common/pagination.vue'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import {
  hasPermission,
  parseTime,
  useDeleteFn,
  useDicts,
  useFormUtil,
  useGet,
  useListData,
  usePost,
  usePut,
  useTableUtil,
} from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { DictDataRouteName, router, systemMenus } from '@/router'
import {
  dictKey,
  type dictType,
  type dictTypeQueryParam,
} from '@/types/system/dict'

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const queryRef = ref<FormInstance>()
const dictRef = ref<FormInstance>()
const showSearch = ref(true)
//  字典数据
const dicts = useDicts(dictKey.sysNormalDisable)
const { formValidate, formReset } = useFormUtil()
const { useTableSelectChange } = useTableUtil()
const { handleSelectionChangeFn, ids, values, single, selected } =
  useTableSelectChange()

const handleSelectionChange = (v: dictType[]) =>
  handleSelectionChangeFn(v, 'dict_type_id', 'dict_name')

const queryParams = ref<dictTypeQueryParam>({
  page_num: 1,
  page_size: 10,
})
const dateRange = ref<[DateModelType, DateModelType]>()
const open = ref(false)
const form = ref<dictType>({
  dict_name: '',
  dict_type: '',
  dict_type_id: undefined,
  remark: '',
  status: '1',
})
const title = ref('')

const {
  list: dictTypeList,
  getListFn: getList,
  total,
} = useListData<dictTypeQueryParam, dictType>(
  ApiSysDictType.getList,
  queryParams,
  dateRange,
)

const rules = ref<FormRules>({
  dict_name: [
    { required: true, message: t('dict_dictNameRuleTip'), trigger: 'blur' },
  ],
  dict_type: [
    { required: true, message: t('dict.dictTypeRuleTip'), trigger: 'blur' },
  ],
})

const resetQuery = () => {
  formReset(queryRef.value)
  dateRange.value = undefined
  getList()
}

const cancel = () => {
  open.value = false
  formReset(dictRef.value)
}

const handleAdd = () => {
  formReset(dictRef.value)
  open.value = true
  form.value.dict_type_id = undefined
  title.value = t('common.add') + t('dict.type')
}
const handleUpdate = async (row?: dictType) => {
  formReset(dictRef.value)
  open.value = true
  const dict_type_id = row?.dict_type_id || ids.value[0]
  const { data, execute } = useGet(ApiSysDictType.getById, { dict_type_id })
  await execute()
  form.value = data.value as dictType
  title.value = t('common.update') + t('dict.type')
}

// 删除数据
const handleDelete = async (row?: dictType) => {
  const flag = await useDeleteFn(
    ApiSysDictType.delete,
    'dict_type_id',
    ids,
    'dict_name',
    values,
    'dict_type_ids',
    row,
  )
  if (flag) getList()
}

const submitForm = async (formRef: FormInstance | undefined) => {
  if (!(await formValidate(formRef))) return
  if (form.value.dict_type_id !== undefined) {
    const { execute, data } = usePut(ApiSysDictType.edit, form)
    await execute()
    if (data.value === ErrorFlag) return
    ElMessage.success(t('commonTip.updateSuccess'))
  } else {
    const { execute, data } = usePost(ApiSysDictType.add, form)
    await execute()
    if (data.value === ErrorFlag) return
    ElMessage.success(t('commonTip.addSuccess'))
  }
  open.value = false
  getList()
}

const goto_data = (row: dictType) => {
  router.push({
    name: DictDataRouteName,
    query: { dict: row.dict_type_id, dict_type: row.dict_type },
  })
}
// 导出名称
defineOptions({
  name: systemMenus.dict.path,
})
</script>
