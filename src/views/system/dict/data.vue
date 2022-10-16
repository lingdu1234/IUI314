<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-10 14:35:22
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-16 18:21:18
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
      label-width="68px"
      class="base-form"
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
          placeholder="请输入字典标签"
          clearable
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
          搜索
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
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 操作区域 -->
    <el-row :gutter="10" class="m-b-8px" style="height: 35px">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          :icon="Plus"
          @click="handleAdd"
          v-if="hasPermission(ApiSysDictData.add)"
        >
          新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          :icon="Edit"
          :disabled="!single"
          @click="handleUpdate"
          v-if="hasPermission(ApiSysDictData.edit)"
        >
          修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          :icon="Delete"
          :disabled="!selected"
          @click="handleDelete"
          v-if="hasPermission(ApiSysDictData.delete)"
        >
          删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain :icon="Close" @click="handleClose">
          关闭
        </el-button>
      </el-col>
      <RightToolBar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>
    <el-table
      :data="dictDataList"
      @selection-change="handleSelectionChange"
      tooltip-effect="light"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="字典编码"
        align="center"
        prop="dict_data_id"
        width="100"
        show-overflow-tooltip
      />
      <el-table-column label="字典标签" align="center" prop="dict_label">
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
      <el-table-column label="字典键值" align="center" prop="dict_value" />
      <el-table-column label="字典排序" align="center" prop="dict_sort" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag
            :options="dicts[dictKey.sysNormalDisable]"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
        align="center"
        prop="remark"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="created_at"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.created_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="150"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button link icon="Edit" @click="handleUpdate(scope.row)">
            修改
          </el-button>
          <el-button link icon="Delete" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      v-model:page="queryParams.page_num"
      v-model:limit="queryParams.page_size"
      :total="total"
      @pagination="getList"
    />
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      v-if="open"
      v-model="open"
      :title="title"
      width="500px"
      append-to-body
    >
      <el-form
        ref="dictRef"
        :model="form"
        :rules="rules"
        label-width="80px"
        class="base-form"
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
            controls-position="right"
            :min="0"
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
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm(dictRef)">
            确 定
          </el-button>
          <el-button @click="cancel"> 取 消 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup name="dict-data">
import {
  Close,
  Delete,
  Edit,
  Plus,
  Refresh,
  Search,
} from '@element-plus/icons-vue'
import { type FormInstance, type FormRules, ElMessage } from 'element-plus'
import { onActivated, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { ApiSysDictData, ApiSysDictType, ErrorFlag } from '@/api/apis'
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
import { router } from '@/router'
import {
  type dictData,
  type dictDataQueryParam,
  type dictType,
  type dictTypeQueryParam,
  dictKey,
} from '@/types/system/dict'

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
  title.value = '添加字典数据'
}
const handleUpdate = async (row?: dictData) => {
  formReset(dictRef.value)
  open.value = true
  const dict_data_id = row?.dict_data_id || ids.value[0]
  const { data, execute } = useGet(ApiSysDictData.getById, { dict_data_id })
  await execute()
  form.value = data.value as dictData
  title.value = '修改字典类型'
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
    ElMessage.success('修改成功')
  } else {
    const { execute, data } = usePost(ApiSysDictData.add, form)
    await execute()
    if (data.value === ErrorFlag) return
    ElMessage.success('新增成功')
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
