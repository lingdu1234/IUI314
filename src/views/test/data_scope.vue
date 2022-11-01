<template>
  <div class="app-container">
    <span>
      数据权限测试：user 为部门A2,<br />
      -- 右上角头像切换角色<br />
      1：超级管理员为全部权限:显示全部数据<br />
      2：自定数据权限：显示部门A1数据<br />
      3：本部门数据权限：显示部门A2数据<br />
      4：本部门及以下数据权限：显示部门A2及以下数据(包括A21)<br />
      5：仅本人数据权限:显示本人数据<br />
    </span>
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="Id" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="dataA" prop="data_a">
        <el-input
          v-model="queryParams.data_a"
          placeholder="请输入A"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="dataB" prop="data_b">
        <el-input
          v-model="queryParams.data_b"
          placeholder="请输入B"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8" style="height: 35px">
      <el-col :span="1.5">
        <el-button type="primary" plain :icon="Plus" @click="handleAdd">
          新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          :icon="Delete"
          :disabled="!selected"
          @click="handleDelete()"
          >删除</el-button
        >
      </el-col>
      <RightToolBar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></RightToolBar>
    </el-row>

    <el-table :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="数据A" align="center" prop="data_a" />
      <el-table-column label="数据B" align="center" prop="data_b" />
      <el-table-column label="创建人" align="center" prop="created_by" />
    </el-table>

    <Pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.page_num"
      v-model:limit="queryParams.page_size"
      @pagination="getList"
    />

    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="data_a" prop="data_a">
          <el-input v-model="form.data_a" placeholder="A" />
        </el-form-item>
        <el-form-item label="data_b" prop="data_b">
          <el-input v-model="form.data_b" placeholder="B" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="data-scope">
import { Delete, Plus, Refresh, Search } from '@element-plus/icons-vue'
import {
  type FormInstance,
  type FormRules,
  ElButton,
  ElCol,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElRow,
  ElTable,
  ElTableColumn,
} from 'element-plus'
import { ref } from 'vue'

import { ErrorFlag } from '@/api/apis'
import { ApiDataScopeTest } from '@/api/tests'
import Pagination from '@/components/common/pagination.vue'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import {
  useDeleteFn,
  useFormUtil,
  useListData,
  usePost,
  useTableUtil,
} from '@/hooks'
import { useUserStore } from '@/stores'
import type {
  testDataScope,
  testDataScopeQueryParam,
} from '@/types/system/test_data_scope'

const userStore = useUserStore()
const { useTableSelectChange } = useTableUtil()
const { formReset, formValidate } = useFormUtil()

const open = ref(false)
const showSearch = ref(true)
const title = ref('')
const queryRef = ref<FormInstance>()
const formRef = ref<FormInstance>()

const queryParams = ref<testDataScopeQueryParam>({
  page_num: 1,
  page_size: 10,
  data_a: undefined,
  data_b: undefined,
  __r__: userStore.user.role,
})
const form = ref<testDataScope>({})
const rules = ref<FormRules>({
  data_a: [{ required: true, message: '岗位名称不能为空', trigger: 'blur' }],
  data_b: [{ required: true, message: '岗位编码不能为空', trigger: 'blur' }],
})

const {
  list,
  getListFn: getList,
  total,
} = useListData<testDataScopeQueryParam, testDataScope>(
  ApiDataScopeTest.getList,
  queryParams
)

const { handleSelectionChangeFn, ids, values, selected } =
  useTableSelectChange()

const handleSelectionChange = (v: testDataScope[]) =>
  handleSelectionChangeFn(v, 'id', 'id')
/** 取消按钮 */
function cancel() {
  open.value = false
  reset()
}
/** 表单重置 */
function reset() {
  form.value = {
    id: undefined,
    data_a: undefined,
    data_b: undefined,
  }
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.page_num = 1
  getList()
}
/** 重置按钮操作 */
function resetQuery() {
  formReset(queryRef.value)
  handleQuery()
}
/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = '添加'
}
const handleDelete = async (row?: testDataScope) => {
  const flag = await useDeleteFn(
    ApiDataScopeTest.delete,
    'id',
    ids,
    'id',
    values,
    'ids',
    row
  )
  if (flag) await getList()
}

/** 提交按钮 */
async function submitForm() {
  if (!(await formValidate(formRef.value))) return
  const { execute, data } = usePost(ApiDataScopeTest.add, form)
  await execute()
  if (data.value === ErrorFlag) return
  ElMessage.success('新增成功')
  cancel()
}
</script>
