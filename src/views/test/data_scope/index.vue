<template>
  <div class="app-container">
    <span>
    数据权限测试：user 为部门A2,<br>
    -- 右上角头像切换角色<br>
     1：超级管理员为全部权限:显示全部数据<br>
     2：自定数据权限：显示部门A1数据<br>
     3：本部门数据权限：显示部门A2数据<br>
     4：本部门及以下数据权限：显示部门A2及以下数据(包括A21)<br>
     5：仅本人数据权限:显示本人数据<br>
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
        <el-button type="primary" icon="Search" @click="handleQuery"
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
          >删除</el-button
        >
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="dataList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="数据A" align="center" prop="data_a" />
      <el-table-column label="数据B" align="center" prop="data_b" />
      <el-table-column label="创建人" align="center" prop="created_by"/>
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

<script setup name="DataScope">
import {
  listData,
  addData,
  delData,
} from '@/api/test/data_scope';
import { useStore } from 'vuex';

const { proxy } = getCurrentInstance();
const store = useStore()

const dataList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref('');

const data = reactive({
  form: {},
  queryParams: {
    page_num: 1,
    page_size: 10,
    data_a: undefined,
    data_b: undefined,
    __r__:store.getters.role
  },
  rules: {
    data_a: [
      { required: true, message: '岗位名称不能为空', trigger: 'blur' },
    ],
    data_b: [
      { required: true, message: '岗位编码不能为空', trigger: 'blur' },
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询岗位列表 */
function getList() {
  loading.value = true;
  listData(queryParams.value).then((response) => {
    dataList.value = response.list;
    total.value = response.total;
    loading.value = false;
  });
}
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}
/** 表单重置 */
function reset() {
  form.value = {
    id: undefined,
    data_a: undefined,
    data_b: undefined,
  };
  proxy.resetForm('postRef');
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm('queryRef');
  handleQuery();
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = '添加岗位';
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs['postRef'].validate((valid) => {
    if (valid) {
      if (form.value.post_id != undefined) {
        proxy.$modal.msgSuccess('不支持修改');
      } else {
        addData(form.value).then((response) => {
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
  const data_ids = row.id ? [row.id] : ids.value;
 
  proxy.$modal
    .confirm('是否确认删除岗位编号为"' + data_ids + '"的数据项？')
    .then(function () {
      return delData({ ids: data_ids });
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess('删除成功');
    })
    .catch(() => {});
}
getList();
</script>
