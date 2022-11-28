<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-10 14:35:22
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\views\system\dict\data.vue
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
      <el-form-item label="字典名称" prop="dictType">
        <el-select v-model="queryParams.dict_type">
          <el-option
            v-for="item in dictTypeList"
            :key="item.dict_type_id"
            :label="item.dict_name"
            :value="item.dict_type"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="字典标签" prop="dict_label">
        <el-input
          v-model="queryParams.dict_label"
          clearable
          placeholder="请输入字典标签"
          @keyup.enter="getList"
        />
      </el-form-item>
      <el-form-item label="字典状态" prop="status">
        <el-select
          v-model="queryParams.status"
          :clearable="true"
          placeholder="字典状态"
        >
          <el-option
            v-for="dict in dicts[dictKey.sysNormalDisable]"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button :icon="Search" type="primary" @click="getList">
          {{ t('common.search') }}
        </el-button>
        <el-button
          :icon="Refresh"
          @click="
            () => {
              formReset(queryRef)
              getList()
            }
          "
        >
          {{ t('common.reset') }}
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 操作区域 -->
    <el-row :gutter="10" class="m-b-8px" style="height: 35px">
      <el-col :span="1.5">
        <el-button
          v-if="hasPermission(ApiSysDictData.add)"
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
          v-if="hasPermission(ApiSysDictData.edit)"
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
          v-if="hasPermission(ApiSysDictData.delete)"
          :disabled="!selected"
          :icon="Delete"
          plain
          type="danger"
          @click="handleDelete()"
        >
          {{ t('common.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button :icon="Close" plain type="warning" @click="handleClose">
          {{ t('common.close') }}
        </el-button>
      </el-col>
      <RightToolBar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>
    <el-table
      :data="dictDataList"
      tooltip-effect="light"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column
        align="center"
        label="字典编码"
        prop="dict_data_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column align="center" label="字典标签" prop="dict_label">
        <template #default="scope">
          <span
            v-if="
              scope.row.list_class == '' || scope.row.list_class == 'default'
            "
            :color="scope.row.css_class"
          >
            {{ scope.row.dict_label }}
          </span>
          <el-tag
            v-else
            :type="
              scope.row.list_class == 'primary' ? '' : scope.row.list_class
            "
          >
            {{ scope.row.dict_label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="字典键值" prop="dict_value" />
      <el-table-column align="center" label="字典排序" prop="dict_sort" />
      <el-table-column align="center" label="状态" prop="status">
        <template #default="scope">
          <DictTag
            :options="dicts[dictKey.sysNormalDisable]"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="备注"
        prop="remark"
      />
      <el-table-column
        align="center"
        label="创建时间"
        prop="created_at"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.created_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        class-name="small-padding fixed-width"
        label="操作"
        width="150"
      >
        <template #default="scope">
          <el-button icon="Edit" link @click="handleUpdate(scope.row)">
            修改
          </el-button>
          <el-button icon="Delete" link @click="handleDelete(scope.row)">
            删除
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
    <!-- 添加或修改参数配置对话框 -->
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
        <el-form-item label="字典类型">
          <el-input v-model="form.dict_type" :disabled="true" />
        </el-form-item>
        <el-form-item label="数据标签" prop="dict_label">
          <el-input v-model="form.dict_label" placeholder="请输入数据标签" />
        </el-form-item>
        <el-form-item label="数据键值" prop="dict_value">
          <el-input v-model="form.dict_value" placeholder="请输入数据键值" />
        </el-form-item>
        <el-form-item label="样式属性" prop="css_class">
          <el-input v-model="form.css_class" placeholder="请输入样式属性" />
        </el-form-item>
        <el-form-item label="显示排序" prop="dict_sort">
          <el-input-number
            v-model="form.dict_sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="回显样式" prop="list_class">
          <el-select v-model="form.list_class">
            <el-option
              v-for="item in listClassOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
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
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            placeholder="请输入内容"
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
  type FormInstance,
  type FormRules,
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
} from 'element-plus'
import { onActivated, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { ApiSysDictData, ApiSysDictType, ErrorFlag } from '@/api/apis'
import DictTag from '@/components/common/dict-tag.vue'
import Pagination from '@/components/common/pagination.vue'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import { Eaction } from '@/components/layout/tab-bar/useTabBar'
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
  type dictType,
  type dictTypeQueryParam,
  dictKey,
} from '@/types/system/dict'

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })

const dicts = useDicts(dictKey.sysNormalDisable)
const { useTableSelectChange } = useTableUtil()
const { handleSelectionChangeFn, ids, values, single, selected } =
  useTableSelectChange()
const handleSelectionChange = (v: dictData[]) =>
  handleSelectionChangeFn(v, 'dict_data_id', 'dict_label')
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
  { value: 'info', label: '信息' },
  { value: 'warning', label: '警告' },
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
  ref<dictTypeQueryParam>({ page_size: Number.MAX_SAFE_INTEGER })
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
  queryParams
)

const handleAdd = () => {
  formReset(dictRef.value)
  open.value = true
  form.value.dict_type = queryParams.value.dict_type
  title.value = t('common.add') + t('dict.dictData')
}
const handleUpdate = async (row?: dictData) => {
  formReset(dictRef.value)
  open.value = true
  const dict_data_id = row?.dict_data_id || ids.value[0]
  const { data, execute } = useGet(ApiSysDictData.getById, { dict_data_id })
  await execute()
  form.value = data.value as dictData
  title.value = t('common.update') + t('dict.dictData')
}

const handleDelete = async (row?: dictData) => {
  const flag = await useDeleteFn(
    ApiSysDictData.delete,
    'dict_data_id',
    ids,
    'dict_label',
    values,
    'dict_data_ids',
    row
  )
  if (flag) getList()
}

const submitForm = async (formRef: FormInstance | undefined) => {
  if (!(await formValidate(formRef))) return
  if (form.value.dict_data_id !== undefined) {
    const { execute, data } = usePut(ApiSysDictData.edit, form)
    await execute()
    if (data.value === ErrorFlag) return
    ElMessage.success(t('commonTip.updateSuccess'))
  } else {
    const { execute, data } = usePost(ApiSysDictData.add, form)
    await execute()
    if (data.value === ErrorFlag) return
    ElMessage.success(t('commonTip.addSuccess'))
  }
  open.value = false
  getList()
}

const cancel = () => {
  formReset(dictRef.value)
  open.value = false
}
const handleClose = () => {
  // 路由回退
  router.back()
  // 关闭当前便签
  setTabBarEmitter(Eaction.current)
}

onActivated(() => {
  getTypeList()
})
onMounted(() => {
  getTypeList()
})
</script>
