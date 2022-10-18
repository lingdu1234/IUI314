<template>
  <div>
    <el-form
      v-show="showSearch"
      ref="queryRef"
      :inline="true"
      :model="queryParams"
      class="base-form"
      label-width="68px"
    >
      <el-form-item label="岗位编码" prop="post_code">
        <el-input
          v-model="queryParams.post_code"
          clearable
          placeholder="请输入岗位编码"
          @keyup.enter="getList"
        />
      </el-form-item>
      <el-form-item label="岗位名称" prop="post_name">
        <el-input
          v-model="queryParams.post_name"
          clearable
          placeholder="请输入岗位名称"
          @keyup.enter="getList"
        />
      </el-form-item>
      <el-form-item label="岗位状态" prop="status">
        <el-select
          v-model="queryParams.status"
          clearable
          placeholder="岗位状态"
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
        <el-button :icon="Refresh" @click="resetQuery"> 重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="m-b-8px" style="height: 35px">
      <el-col :span="1.5">
        <el-button
          v-if="hasPermission(ApiSysPost.add)"
          :icon="Plus"
          plain
          type="primary"
          @click="handleAdd"
        >
          新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-if="hasPermission(ApiSysPost.edit)"
          :disabled="!single"
          :icon="Edit"
          plain
          type="success"
          @click="handleUpdate"
        >
          修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-if="hasPermission(ApiSysPost.delete)"
          :disabled="!selected"
          :icon="Delete"
          plain
          type="danger"
          @click="handleDelete"
        >
          删除
        </el-button>
      </el-col>
      <RightToolBar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>
    <!--    表格区域-->
    <el-table
      :data="postListData"
      @selection-change="handleSelectionChange"
      tooltip-effect="light"
    >
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column
        align="center"
        label="岗位编号"
        prop="post_id"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="岗位编码"
        prop="post_code"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="岗位名称"
        prop="post_name"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="岗位排序"
        prop="post_sort"
        show-overflow-tooltip
      />
      <el-table-column align="center" label="状态" prop="status">
        <template #default="scope">
          <dict-tag
            :options="dicts[dictKey.sysNormalDisable]"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="创建时间"
        prop="created_at"
        show-overflow-tooltip
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.created_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="hasPermission(ApiSysPost.edit, ApiSysPost.delete)"
        align="center"
        label="操作"
        width="150px"
      >
        <template #default="scope">
          <el-button
            v-if="hasPermission(ApiSysPost.edit)"
            :icon="Edit"
            link
            @click="handleUpdate(scope.row)"
          >
            修改
          </el-button>
          <el-button
            v-if="hasPermission(ApiSysPost.delete)"
            :icon="Delete"
            link
            @click="handleDelete(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      v-model:limit="queryParams.page_size"
      v-model:page="queryParams.page_num"
      :total="total"
      @pagination="getList"
    />
    <!--    编辑form区域-->
    <PostManageDialog
      v-if="open"
      :open="open"
      :post-data="postData"
      :title="title"
      @close-dialog="closeDialog"
    />
  </div>
</template>
<script lang="ts" setup>
import { Delete, Edit, Plus, Refresh, Search } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { ref } from 'vue'

import { ApiSysPost } from '@/api/apis'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import {
  hasPermission,
  parseTime,
  useDeleteFn,
  useDicts,
  useFormUtil,
  useListData,
  useTableUtil,
} from '@/hooks'
import { systemMenus } from '@/router'
import { dictKey } from '@/types/system/dict'
import type { post, postQueryParam } from '@/types/system/post'

import PostManageDialog from './pages/post-manage-dialog.vue'

const showSearch = ref(true)
const queryRef = ref<FormInstance>()
const dicts = useDicts(dictKey.sysNormalDisable)
const open = ref(false)
const title = ref('')
const postData = ref<post>({})
const { useTableSelectChange } = useTableUtil()
const { formReset } = useFormUtil()

const queryParams = ref<postQueryParam>({
  page_size: 10,
  page_num: 1,
})

const {
  list: postListData,
  getListFn: getList,
  total,
} = useListData<postQueryParam, post>(ApiSysPost.getList, queryParams)

const { handleSelectionChangeFn, ids, values, single, selected } =
  useTableSelectChange()

const handleSelectionChange = (v: post[]) =>
  handleSelectionChangeFn(v, 'post_id', 'post_name')

const handleAdd = () => {
  postData.value = { status: '1' }
  title.value = '新增岗位'
  open.value = true
}
const handleUpdate = (row: post) => {
  postData.value = row
  title.value = `更新岗位-${row.post_name}`
  open.value = true
}

const handleDelete = async (row?: post) => {
  const flag = await useDeleteFn(
    ApiSysPost.delete,
    'post_id',
    ids,
    'post_name',
    values,
    'post_ids',
    row
  )
  if (flag) await getList()
}

const resetQuery = () => {
  formReset(queryRef.value)
  getList()
}

const closeDialog = () => {
  open.value = false
  getList()
}

//组件名称
defineOptions({
  name: systemMenus.postManage.path,
})
</script>
