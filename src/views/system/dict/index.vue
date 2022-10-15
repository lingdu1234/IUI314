<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-03 23:56:33
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-15 09:04:42
 * @FilePath: \IUI314\src\views\system\dict\index.vue
 * @Description: 字典类型数据
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
      <el-form-item label="字典名称" prop="dict_name">
        <el-input
          v-model="queryParams.dict_name"
          clearable
          placeholder="请输入字典名称"
          @keyup.enter="getList"
        />
      </el-form-item>
      <el-form-item label="字典类型" prop="dict_type">
        <el-input
          v-model="queryParams.dict_type"
          clearable
          placeholder="请输入字典类型"
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
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          end-placeholder="结束日期"
          range-separator="-"
          start-placeholder="开始日期"
          type="daterange"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item>
        <el-button :icon="Search" type="primary" @click="getList">
          搜索
        </el-button>
        <el-button :icon="Refresh" @click="resetQuery"> 重置 </el-button>
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
          v-if="hasPermission(ApiSysDictType.add)"
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
          v-if="hasPermission(ApiSysDictType.edit)"
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
          v-if="hasPermission(ApiSysDictType.delete)"
        >
          删除
        </el-button>
      </el-col>
      <RightToolBar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <!-- 表格区域 -->
    <el-table
      :data="dictTypeList"
      @selection-change="handleSelectionChange"
      tooltip-effect="light"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="字典编号"
        align="center"
        prop="dict_type_id"
        width="100"
        show-overflow-tooltip
      />
      <el-table-column
        label="字典名称"
        align="center"
        prop="dict_name"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="字典类型"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template #default="scope">
          <el-link type="primary" @click="goto_data(scope.row)">
            {{ scope.row.dict_type }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <DictTag
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
        class-name="small-padding fixed-width"
        width="150"
      >
        <template #default="scope">
          <el-button
            link
            :icon="Edit"
            @click="handleUpdate(scope.row)"
            v-if="hasPermission(ApiSysDictType.edit)"
          >
            修改
          </el-button>
          <el-button
            type="danger"
            link
            :icon="Delete"
            @click="handleDelete(scope.row)"
            v-if="hasPermission(ApiSysDictType.delete)"
          >
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
    <!-- 添加对话框 -->
    <el-dialog v-model="open" :title="title" width="500px" append-to-body>
      <el-form ref="dictRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="字典名称" prop="dict_name">
          <el-input v-model="form.dict_name" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典类型" prop="dict_type">
          <el-input v-model="form.dict_type" placeholder="请输入字典类型" />
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
<script lang="ts" setup>
import { Delete, Edit, Plus, Refresh, Search } from '@element-plus/icons-vue'
import { type FormInstance, type FormRules, ElMessage } from 'element-plus'
import { ref } from 'vue'

import { ApiSysDictType, ErrorFlag } from '@/api/apis'
import DictTag from '@/components/common/dict-tag.vue'
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
import { router, systemMenus } from '@/router'
import {
  type dictType,
  type dictTypeQueryParam,
  dictKey,
} from '@/types/system/dict'

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
const dateRange = ref<string[]>([])
const open = ref(false)
const form = ref<dictType>({
  dict_name: '',
  dict_type: '',
  dict_type_id: undefined,
  remark: '',
  status: '1',
})
const title = ref('')

// const {
//   list: dictTypeList,
//   getListFn: getList,
//   total,
// } = getDictTypeList(queryParams, dateRange)

const {
  list: dictTypeList,
  getListFn: getList,
  total,
} = useListData<dictTypeQueryParam, dictType>(
  ApiSysDictType.getList,
  queryParams,
  dateRange
)

const rules = ref<FormRules>({
  dict_name: [{ required: true, message: '字典名称不能为空', trigger: 'blur' }],
  dict_type: [{ required: true, message: '字典类型不能为空', trigger: 'blur' }],
})

const resetQuery = () => {
  formReset(queryRef.value)
  dateRange.value = []
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
  title.value = '添加字典类型'
}
const handleUpdate = async (row?: dictType) => {
  formReset(dictRef.value)
  open.value = true
  const dict_type_id = row?.dict_type_id || ids.value[0]
  const { data, execute } = useGet(ApiSysDictType.getById, { dict_type_id })
  await execute()
  form.value = data.value as dictType
  title.value = '修改字典类型'
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
    row
  )
  if (flag) getList()
}

const submitForm = async (formRef: FormInstance | undefined) => {
  if (!formValidate(formRef)) return
  if (form.value.dict_type_id !== undefined) {
    const { execute, data } = usePut(ApiSysDictType.edit, form)
    await execute()
    if (data.value === ErrorFlag) return
    ElMessage.success('修改成功')
  } else {
    const { execute, data } = usePost(ApiSysDictType.add, form)
    await execute()
    if (data.value === ErrorFlag) return
    ElMessage.success('新增成功')
  }
  open.value = false
  getList()
}

function goto_data(row: dictType) {
  router.push({
    name: 'dict_data',
    query: { dict: row.dict_type_id, dict_type: row.dict_type },
  })
}
// 导出名称
defineOptions({
  name: systemMenus.dict.path,
})
</script>
