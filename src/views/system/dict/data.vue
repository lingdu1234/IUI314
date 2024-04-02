<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-10 14:35:22
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\views\system\dict\data.vue
 * @Description:
-->
<script lang="ts" name="dict-data" setup>
import {
  Close,
  Delete,
  Edit,
  Plus,
  Refresh,
  Search,
} from '@element-plus/icons-vue'
import {
  ElButton,
  ElCol,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElMessage,
  ElOption,
  ElRadio,
  ElRadioGroup,
  ElRow,
  ElSelect,
  ElTable,
  ElTableColumn,
  ElTag,
  type FormInstance,
  type FormRules,
} from 'element-plus'
import { onActivated, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { ApiSysDictData, ApiSysDictType, ErrorFlag } from '@/api/apis'
import DictTag from '@/components/common/dict-tag.vue'
import Pagination from '@/components/common/pagination.vue'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import { TabAction } from '@/components/layout/tab-bar/useTabBar'
import {
  hasPermission,
  parseTime,
  setTabBarEmitter,
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
import { router } from '@/router'
import {
  type dictData,
  type dictDataQueryParam,
  dictKey,
  type dictType,
  type dictTypeQueryParam,
} from '@/types/system/dict'

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })

const dicts = useDicts(dictKey.sysNormalDisable)
const { useTableSelectChange } = useTableUtil()
const { handleSelectionChangeFn, ids, values, single, selected }
  = useTableSelectChange()
function handleSelectionChange(v: dictData[]) {
  return handleSelectionChangeFn(v, 'dict_data_id', 'dict_label')
}
const { formReset, formValidate } = useFormUtil()
const route = useRoute()

const showSearch = ref(true)
const queryRef = ref<FormInstance | undefined>()
const dictRef = ref<FormInstance | undefined>()
const open = ref(false)
const title = ref('')

const queryParams = ref<dictDataQueryParam>({
  page_num: 1,
  page_size: 10,
  dict_type: route.query.dict_type as string,
})

const form = ref<dictData>({
  status: '1',
  dict_sort: 1,
  is_default: 'N',
})
// 数据标签回显样式
const listClassOptions = ref([
  { value: 'default', label: '默认' },
  { value: 'primary', label: '主要' },
  { value: 'success', label: '成功' },
  { value: 'warning', label: '警告' },
  { value: 'info', label: '信息' },
  { value: 'danger', label: '危险' },
])
const rules = ref<FormRules>({
  dict_label: [
    { required: true, message: '数据标签不能为空', trigger: 'blur' },
  ],
  dict_value: [
    { required: true, message: '数据键值不能为空', trigger: 'blur' },
  ],
  dict_sort: [{ required: true, message: '数据顺序不能为空', trigger: 'blur' }],
})

// 请求字典类型数据
// const { list: dictTypeList, getListFn: getTypeList } = getDictTypeList(
//   ref<dictTypeQueryParam>({
//     page_size: Number.MAX_SAFE_INTEGER,
//   })
// )

// 请求字典类型数据
const { list: dictTypeList, getListFn: getTypeList } = useListData<
  dictTypeQueryParam,
  dictType
>(
  ApiSysDictType.getList,
  ref<dictTypeQueryParam>({ page_size: Number.MAX_SAFE_INTEGER }),
)
// 请求字典结果数据
// const {
//   list: dictDataList,
//   getListFn: getList,
//   total,
// } = getDictDataList(queryParams)

// 请求字典结果数据
const {
  list: dictDataList,
  getListFn: getList,
  total,
} = useListData<dictDataQueryParam, dictData>(
  ApiSysDictData.getList,
  queryParams,
)

function handleAdd() {
  formReset(dictRef.value)
  open.value = true
  form.value.dict_type = queryParams.value.dict_type
  title.value = t('common.add') + t('dict.dictData')
}
async function handleUpdate(row?: dictData) {
  formReset(dictRef.value)
  open.value = true
  const dict_data_id = row?.dict_data_id || ids.value[0]
  const { data, execute } = useGet(ApiSysDictData.getById, { dict_data_id })
  await execute()
  form.value = data.value as dictData
  title.value = t('common.update') + t('dict.dictData')
}

async function handleDelete(row?: dictData) {
  const flag = await useDeleteFn(
    ApiSysDictData.delete,
    'dict_data_id',
    ids,
    'dict_label',
    values,
    'dict_data_ids',
    row,
  )
  if (flag)
    getList()
}

async function submitForm(formRef: FormInstance | undefined) {
  if (!(await formValidate(formRef)))
    return
  if (form.value.dict_data_id !== undefined) {
    const { execute, data } = usePut(ApiSysDictData.edit, form)
    await execute()
    if (data.value === ErrorFlag)
      return
    ElMessage.success(t('commonTip.updateSuccess'))
  }
  else {
    const { execute, data } = usePost(ApiSysDictData.add, form)
    await execute()
    if (data.value === ErrorFlag)
      return
    ElMessage.success(t('commonTip.addSuccess'))
  }
  open.value = false
  getList()
}

function cancel() {
  formReset(dictRef.value)
  open.value = false
}
function handleClose() {
  // 路由回退
  router.back()
  // 关闭当前便签
  setTabBarEmitter(TabAction.current)
}

onActivated(() => {
  getTypeList()
})
onMounted(() => {
  getTypeList()
})
</script>

<template>
  <div>
    <ElForm
      v-show="showSearch"
      ref="queryRef"
      :inline="true"
      :model="queryParams"
      class="base-form"
      label-width="80px"
    >
      <ElFormItem label="字典名称" prop="dictType">
        <ElSelect v-model="queryParams.dict_type">
          <ElOption
            v-for="item in dictTypeList"
            :key="item.dict_type_id"
            :label="item.dict_name"
            :value="item.dict_type"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="字典标签" prop="dict_label">
        <ElInput
          v-model="queryParams.dict_label"
          clearable
          placeholder="请输入字典标签"
          @keyup.enter="getList"
        />
      </ElFormItem>
      <ElFormItem label="字典状态" prop="status">
        <ElSelect
          v-model="queryParams.status"
          :clearable="true"
          placeholder="字典状态"
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
        <ElButton
          :icon="Refresh"
          @click="
            () => {
              formReset(queryRef)
              getList()
            }
          "
        >
          {{ t('common.reset') }}
        </ElButton>
      </ElFormItem>
    </ElForm>
    <!-- 操作区域 -->
    <ElRow :gutter="10" class="m-b-8px">
      <ElCol :span="1.5">
        <ElButton
          v-if="hasPermission(ApiSysDictData.add)"
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
          v-if="hasPermission(ApiSysDictData.edit)"
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
          v-if="hasPermission(ApiSysDictData.delete)"
          :disabled="!selected"
          :icon="Delete"
          plain
          type="danger"
          @click="handleDelete()"
        >
          {{ t('common.delete') }}
        </ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton :icon="Close" plain type="warning" @click="handleClose">
          {{ t('common.close') }}
        </ElButton>
      </ElCol>
      <RightToolBar v-model:showSearch="showSearch" @query-table="getList" />
    </ElRow>
    <ElTable
      :data="dictDataList"
      tooltip-effect="light"
      @selection-change="handleSelectionChange"
    >
      <ElTableColumn align="center" type="selection" width="55" />
      <ElTableColumn
        align="center"
        label="字典编码"
        prop="dict_data_id"
        show-overflow-tooltip
        width="100"
      />
      <ElTableColumn align="center" label="字典标签" prop="dict_label">
        <template #default="scope">
          <span
            v-if="
              scope.row.list_class == '' || scope.row.list_class == 'default'
            "
            :color="scope.row.css_class"
          >
            {{ scope.row.dict_label }}
          </span>
          <ElTag
            v-else
            :type="
              scope.row.list_class == 'primary' ? '' : scope.row.list_class
            "
          >
            {{ scope.row.dict_label }}
          </ElTag>
        </template>
      </ElTableColumn>
      <ElTableColumn align="center" label="字典键值" prop="dict_value" />
      <ElTableColumn align="center" label="字典排序" prop="dict_sort" />
      <ElTableColumn align="center" label="状态" prop="status">
        <template #default="scope">
          <DictTag
            :options="dicts[dictKey.sysNormalDisable]"
            :value="scope.row.status"
          />
        </template>
      </ElTableColumn>
      <ElTableColumn
        :show-overflow-tooltip="true"
        align="center"
        label="备注"
        prop="remark"
      />
      <ElTableColumn
        align="center"
        label="创建时间"
        prop="created_at"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.created_at) }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn
        align="center"
        class-name="small-padding fixed-width"
        label="操作"
        width="150"
      >
        <template #default="scope">
          <ElButton icon="Edit" link @click="handleUpdate(scope.row)">
            修改
          </ElButton>
          <ElButton icon="Delete" link @click="handleDelete(scope.row)">
            删除
          </ElButton>
        </template>
      </ElTableColumn>
    </ElTable>

    <Pagination
      v-show="total > 0"
      v-model:limit="queryParams.page_size"
      v-model:page="queryParams.page_num"
      :total="total"
      @pagination="getList"
    />
    <!-- 添加或修改参数配置对话框 -->
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
        <ElFormItem label="字典类型">
          <ElInput v-model="form.dict_type" :disabled="true" />
        </ElFormItem>
        <ElFormItem label="数据标签" prop="dict_label">
          <ElInput v-model="form.dict_label" placeholder="请输入数据标签" />
        </ElFormItem>
        <ElFormItem label="数据键值" prop="dict_value">
          <ElInput v-model="form.dict_value" placeholder="请输入数据键值" />
        </ElFormItem>
        <ElFormItem label="样式属性" prop="css_class">
          <ElInput v-model="form.css_class" placeholder="请输入样式属性" />
        </ElFormItem>
        <ElFormItem label="显示排序" prop="dict_sort">
          <ElInputNumber
            v-model="form.dict_sort"
            :min="0"
            controls-position="right"
          />
        </ElFormItem>
        <ElFormItem label="回显样式" prop="list_class">
          <ElSelect v-model="form.list_class">
            <ElOption
              v-for="item in listClassOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="状态" prop="status">
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
        <ElFormItem label="备注" prop="remark">
          <ElInput
            v-model="form.remark"
            placeholder="请输入内容"
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
