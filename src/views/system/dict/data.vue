<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="字典名称" prop="dictType">
        <el-select v-model="queryParams.dict_type" size="small">
          <el-option
            v-for="item in typeOptions"
            :key="item.dict_id"
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
          size="small"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="数据状态"
          clearable
          size="small"
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
        <el-button type="primary" icon="Search" size="mini" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="Refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:dict:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:dict:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:dict:remove']"
          >删除</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:dict:export']"
          >导出</el-button
        >
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Close"
          size="mini"
          @click="handleClose"
          >关闭</el-button
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
            >{{ scope.row.dict_label }}</span
          >
          <el-tag
            v-else
            :type="
              scope.row.list_class == 'primary' ? '' : scope.row.list_class
            "
            >{{ scope.row.dict_label }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="字典键值" align="center" prop="dict_value" />
      <el-table-column label="字典排序" align="center" prop="dict_sort" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
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
          <el-button
            size="mini"
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:dict:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:dict:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="dataRef" :model="form" :rules="rules" label-width="80px">
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
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
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
          ></el-input>
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

<script setup name="Data">
import { listType, getType } from '@/api/system/dict/type';
import {
  listData,
  getData,
  delData,
  addData,
  updateData,
} from '@/api/system/dict/data';

const { proxy } = getCurrentInstance();
const { sys_normal_disable } = proxy.useDict('sys_normal_disable');

const dataList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const labels = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref('');
const defaultDictType = ref('');
const typeOptions = ref([]);
const route = useRoute();
// 数据标签回显样式
const listClassOptions = ref([
  { value: 'default', label: '默认' },
  { value: 'primary', label: '主要' },
  { value: 'success', label: '成功' },
  { value: 'info', label: '信息' },
  { value: 'warning', label: '警告' },
  { value: 'danger', label: '危险' },
]);

const data = reactive({
  form: {},
  queryParams: {
    page_num: 1,
    page_size: 10,
    dict_name: undefined,
    dict_type: undefined,
    status: undefined,
  },
  rules: {
    dictLabel: [
      { required: true, message: '数据标签不能为空', trigger: 'blur' },
    ],
    dictValue: [
      { required: true, message: '数据键值不能为空', trigger: 'blur' },
    ],
    dictSort: [
      { required: true, message: '数据顺序不能为空', trigger: 'blur' },
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询字典类型详细 */
function getTypes(dictId) {
  getType(dictId).then((response) => {
    queryParams.value.dict_type = response.dict_type;
    defaultDictType.value = response.dict_type;
    getList();
  });
}

/** 查询字典类型列表 */
function getTypeList() {
  listType().then((response) => {
    typeOptions.value = response.list;
  });
}
/** 查询字典数据列表 */
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
    dict_data_id: undefined,
    dict_label: undefined,
    dict_value: undefined,
    css_class: undefined,
    list_class: 'default',
    dict_sort: 0,
    is_default: 'N',
    status: '1',
    remark: undefined,
  };
  proxy.resetForm('dataRef');
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}
/** 返回按钮操作 */
function handleClose() {
  proxy.$router.back();
  proxy.$tab.closeOpenPage();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm('queryRef');
  queryParams.value.dict_type = defaultDictType;
  handleQuery();
}
/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = '添加字典数据';
  form.value.dict_type = queryParams.value.dict_type;
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.dict_data_id);
  labels.value = selection.map((item) => item.dict_label);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const dict_data_id = row.dict_data_id;
  getData({ dict_data_id }).then((response) => {
    form.value = response;
    open.value = true;
    title.value = '修改字典数据';
  });
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs['dataRef'].validate((valid) => {
    console.log(`form.value`, form.value);
    if (valid) {
      if (form.value.dict_data_id != undefined) {
        updateData(form.value).then((response) => {
          proxy.$modal.msgSuccess('修改成功');
          open.value = false;
          getList();
        });
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
  const dict_data_ids = row.dict_data_id ? [row.dict_data_id] : ids.value;
  const dict_data_labels = row.dict_data_id ? row.dict_label : labels.value;
  proxy.$modal
    .confirm('是否确认删除字典编码为"' + dict_data_labels + '"的数据项？')
    .then(function () {
      return delData({ dict_data_ids });
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess('删除成功');
    })
    .catch(() => {});
}
/** 导出按钮操作 */
// function handleExport() {
//   proxy.download(
//     'system/dict/data/export',
//     {
//       ...queryParams.value,
//     },
//     `dict_data_${new Date().getTime()}.xlsx`
//   );
// }

getTypes({ dict_type_id: route.params && route.params.dict_type_id });
getTypeList();
</script>
