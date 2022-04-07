<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="岗位编码" prop="post_code">
        <el-input
          v-model="queryParams.post_code"
          placeholder="请输入岗位编码"
          clearable
          @keyup.enter="getList"
        />
      </el-form-item>
      <el-form-item label="岗位名称" prop="post_name">
        <el-input
          v-model="queryParams.post_name"
          placeholder="请输入岗位名称"
          clearable
          @keyup.enter="getList"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="岗位状态"
          clearable
        >
          <el-option
            v-for="dict in sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="getList"
          >搜索</el-button
        >
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8" style="height: 35px">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['system/post/add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system/post/edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system/post/delete']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['system/post/export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="postList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="岗位编号"
        align="center"
        width="100"
        show-overflow-tooltip
        prop="post_id"
      />
      <el-table-column label="岗位编码" align="center" prop="post_code" />
      <el-table-column label="岗位名称" align="center" prop="post_name" />
      <el-table-column label="岗位排序" align="center" prop="post_sort" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
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
        v-hasPermi="['system/post/delete', 'system/post/edit']"
      >
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system/post/edit']"
            >修改</el-button
          >
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system/post/delete']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.page_num"
      v-model:limit="queryParams.page_size"
      @pagination="getList"
    />

    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="postRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="岗位名称" prop="post_name">
          <el-input v-model="form.post_name" placeholder="请输入岗位名称" />
        </el-form-item>
        <el-form-item label="岗位编码" prop="post_code">
          <el-input v-model="form.post_code" placeholder="请输入编码名称" />
        </el-form-item>
        <el-form-item label="岗位顺序" prop="post_sort">
          <el-input-number
            v-model="form.post_sort"
            controls-position="right"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="岗位状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
              >{{ dict.label }}</el-radio
            >
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
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Post">
import { getCurrentInstance,ref,toRefs,reactive } from 'vue';
import {
  listPost,
  addPost,
  delPost,
  getPost,
  updatePost,
} from '@/api/system/post';

const { proxy } = getCurrentInstance();
const { sys_normal_disable } = proxy.useDict('sys_normal_disable');

const postList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const post_names = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref('');

const data = reactive({
  form: {},
  queryParams: {
    page_num: 1,
    page_size: 10,
    post_code: undefined,
    post_name: undefined,
    status: undefined,
  },
  rules: {
    post_name: [
      { required: true, message: '岗位名称不能为空', trigger: 'blur' },
    ],
    post_code: [
      { required: true, message: '岗位编码不能为空', trigger: 'blur' },
    ],
    post_sort: [
      { required: true, message: '岗位顺序不能为空', trigger: 'blur' },
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询岗位列表 */
async function getList() {
  loading.value = true;
  const response = await listPost(queryParams.value);
  postList.value = response.list;
  total.value = response.total;
  loading.value = false;
}
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}
/** 表单重置 */
function reset() {
  form.value = {
    post_id: undefined,
    post_code: undefined,
    post_name: undefined,
    post_sort: 0,
    status: '1',
    remark: undefined,
  };
  proxy.resetForm('postRef');
}

/** 重置按钮操作 */
const resetQuery = async () => {
  proxy.resetForm('queryRef');
  queryParams.value.page_num = 1;
  await getList();
};
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.post_id);
  post_names.value = selection.map((item) => item.post_name);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = '添加岗位';
}
/** 修改按钮操作 */
async function handleUpdate(row) {
  reset();
  const post_id = row.post_id || ids.value[0];
  const response = await getPost({ post_id });
  form.value = response;
  open.value = true;
  title.value = '修改岗位';
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs['postRef'].validate((valid) => {
    if (valid) {
      if (form.value.post_id != undefined) {
        updatePost(form.value).then((response) => {
          proxy.$modal.msgSuccess('修改成功');
          open.value = false;
          getList();
        });
      } else {
        addPost(form.value).then((response) => {
          proxy.$modal.msgSuccess('新增成功');
          open.value = false;
          getList();
        });
      }
    }
  });
}
/** 删除按钮操作 */
function handleDelete(row) {
  const post_ids = row.post_id ? [row.post_id] : ids.value;
  const postNames = row.post_id ? row.post_name : post_names.value;
  proxy.$modal
    .confirm('是否确认删除岗位编号为"' + postNames + '"的数据项？')
    .then(function () {
      return delPost({ post_ids });
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess('删除成功');
    })
    .catch(() => {});
}
/** 导出按钮操作 */
function handleExport() {
  proxy.download(
    'system/post/export',
    {
      ...queryParams.value,
    },
    `post_${new Date().getTime()}.xlsx`
  );
}

getList();
</script>
