<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="dept_name"
            placeholder="请输入部门名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="{ label: 'dept_name', children: 'children' }"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="deptTreeRef"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryRef"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item label="用户名称" prop="user_name">
            <el-input
              v-model="queryParams.user_name"
              placeholder="请输入用户名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="手机号码" prop="phone_num">
            <el-input
              v-model="queryParams.phone_num"
              placeholder="请输入手机号码"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="user_status">
            <el-select
              v-model="queryParams.user_status"
              placeholder="用户状态"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="dict in sys_normal_disable"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 240px"
              value-format="YYYY-MM-DD"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="Search"
              size="mini"
              @click="handleQuery"
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
              v-hasPermi="['system:user:add']"
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
              v-hasPermi="['system:user:edit']"
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
              v-hasPermi="['system:user:remove']"
              >删除</el-button
            >
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button
              type="info"
              plain
              icon="Upload"
              size="mini"
              @click="handleImport"
              v-hasPermi="['system:user:import']"
              >导入</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['system:user:export']"
              >导出</el-button
            >
          </el-col> -->
          <right-toolbar
            v-model:showSearch="showSearch"
            @queryTable="getList"
            :columns="columns"
          ></right-toolbar>
        </el-row>

        <el-table
          v-loading="loading"
          :data="userList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column
            label="用户编号"
            align="center"
            key="id"
            prop="id"
            v-if="columns[0].visible"
            width="100"
            show-overflow-tooltip
          />
          <el-table-column
            label="用户名称"
            align="center"
            key="user_name"
            prop="user_name"
            v-if="columns[1].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="用户昵称"
            align="center"
            key="user_nickname"
            prop="user_nickname"
            v-if="columns[2].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="部门"
            align="center"
            key="dept_id"
            prop="dept.dept_name"
            v-if="columns[3].visible"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            label="手机号码"
            align="center"
            key="phone_num"
            prop="phone_num"
            v-if="columns[4].visible"
            width="120"
          />
          <el-table-column
            label="状态"
            align="center"
            key="user_status"
            v-if="columns[5].visible"
          >
            <template #default="scope">
              <el-switch
                v-model="scope.row.user_status"
                active-value="1"
                inactive-value="0"
                @change="handleStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            align="center"
            prop="created_at"
            v-if="columns[6].visible"
            width="150"
          >
            <template #default="scope">
              <span>{{ parseTime(scope.row.created_at) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="180"
            class-name="small-padding fixed-width"
          >
            <template #default="scope">
              <el-button
                size="mini"
                v-if="scope.row.user_id !== 1"
                type="text"
                icon="Edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:user:edit']"
                >修改</el-button
              >
              <el-button
                size="mini"
                v-if="scope.row.user_id !== 1"
                type="text"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:user:remove']"
                >删除</el-button
              >
              <el-dropdown
                v-if="scope.row.user_id !== 1"
                @command="(command) => handleCommand(command, scope.row)"
              >
                <span
                  class="el-dropdown-link"
                  v-hasPermi="['system:user:resetPwd', 'system:user:edit']"
                >
                  <el-icon><d-arrow-right /></el-icon>更多
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      command="handleResetPwd"
                      icon="Key"
                      v-hasPermi="['system:user:resetPwd']"
                      >重置密码</el-dropdown-item
                    >
                    <el-dropdown-item
                      command="handleAuthRole"
                      icon="CircleCheck"
                      v-hasPermi="['system:user:edit']"
                      >分配角色</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
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
      </el-col>
    </el-row>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form :model="form" :rules="rules" ref="userRef" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="user_nickname">
              <el-input
                v-model="form.user_nickname"
                placeholder="请输入用户昵称"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属部门" prop="dept_id">
              <tree-select
                v-model:value="form.dept_id"
                :options="deptOptions"
                placeholder="请选择归属部门"
                :objMap="{
                  value: 'dept_id',
                  label: 'dept_name',
                  children: 'children',
                }"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone_num">
              <el-input
                v-model="form.phone_num"
                placeholder="请输入手机号码"
                maxlength="11"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="form.user_email"
                placeholder="请输入邮箱"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              v-if="form.id == undefined"
              label="用户名称"
              prop="user_name"
            >
              <el-input
                v-model="form.user_name"
                placeholder="请输入用户名称"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="form.id == undefined"
              label="用户密码"
              prop="user_password"
            >
              <el-input
                v-model="form.user_password"
                placeholder="请输入用户密码"
                type="password"
                maxlength="20"
                show-password
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户性别">
              <el-select v-model="form.sex" placeholder="请选择">
                <el-option
                  v-for="dict in sys_user_sex"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.user_status">
                <el-radio
                  v-for="dict in sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                  >{{ dict.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="岗位">
              <el-select v-model="form.post_ids" multiple placeholder="请选择">
                <el-option
                  v-for="item in postOptions"
                  :key="item.post_id"
                  :label="item.post_name"
                  :value="item.post_id"
                  :disabled="item.status == '0'"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-select v-model="form.role_ids" multiple placeholder="请选择">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.role_id"
                  :label="item.role_name"
                  :value="item.role_id"
                  :disabled="item.status == '0'"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <!-- <el-dialog
      :title="upload.title"
      v-model="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="uploadRef"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <div class="el-upload__tip">
              <el-checkbox
                v-model="upload.updateSupport"
              />是否更新已经存在的用户数据
            </div>
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link
              type="primary"
              :underline="false"
              style="font-size: 12px; vertical-align: baseline"
              @click="importTemplate"
              >下载模板</el-link
            >
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog> -->
  </div>
</template>

<script setup name="User">
import { getToken } from '@/utils/auth';
import { treeselect } from '@/api/system/dept';
import { listPost } from '@/api/system/post';
import { listRole } from '@/api/system/role';
import {
  changeUserStatus,
  listUser,
  resetUserPwd,
  delUser,
  getUser,
  updateUser,
  addUser,
} from '@/api/system/user';

const router = useRouter();
const { proxy } = getCurrentInstance();
const { sys_normal_disable, sys_user_sex } = proxy.useDict(
  'sys_normal_disable',
  'sys_user_sex'
);

const userList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const user_names = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref('');
const dateRange = ref([]);
const dept_name = ref('');
const deptOptions = ref(undefined);
const initPassword = ref(undefined);
const postOptions = ref([]);
const roleOptions = ref([]);
/*** 用户导入参数 */
// const upload = reactive({
//   // 是否显示弹出层（用户导入）
//   open: false,
//   // 弹出层标题（用户导入）
//   title: '',
//   // 是否禁用上传
//   isUploading: false,
//   // 是否更新已经存在的用户数据
//   updateSupport: 0,
//   // 设置上传的请求头部
//   headers: { Authorization: 'Bearer ' + getToken() },
//   // 上传的地址
//   url: import.meta.env.VITE_APP_BASE_API + 'system/user/importData',
// });
// 列显隐信息
const columns = ref([
  { key: 0, label: `用户编号`, visible: true },
  { key: 1, label: `用户名称`, visible: true },
  { key: 2, label: `用户昵称`, visible: true },
  { key: 3, label: `部门`, visible: true },
  { key: 4, label: `手机号码`, visible: true },
  { key: 5, label: `状态`, visible: true },
  { key: 6, label: `创建时间`, visible: true },
]);

const data = reactive({
  form: {},
  queryParams: {
    page_num: 1,
    page_size: 10,
    user_name: undefined,
    phone_num: undefined,
    user_status: undefined,
    dept_id: undefined,
  },
  rules: {
    user_name: [
      { required: true, message: '用户名称不能为空', trigger: 'blur' },
      {
        min: 2,
        max: 20,
        message: '用户名称长度必须介于 2 和 20 之间',
        trigger: 'blur',
      },
    ],
    user_nickname: [
      { required: true, message: '用户昵称不能为空', trigger: 'blur' },
    ],
    user_password: [
      { required: true, message: '用户密码不能为空', trigger: 'blur' },
      {
        min: 5,
        max: 20,
        message: '用户密码长度必须介于 5 和 20 之间',
        trigger: 'blur',
      },
    ],
    user_email: [
      {
        type: 'email',
        message: "'请输入正确的邮箱地址",
        trigger: ['blur', 'change'],
      },
    ],
    phone_num: [
      {
        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        message: '请输入正确的手机号码',
        trigger: 'blur',
      },
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};
/** 根据名称筛选部门树 */
watch(dept_name, (val) => {
  proxy.$refs['deptTreeRef'].filter(val);
});
/** 查询部门下拉树结构 */
function getTreeselect() {
  treeselect().then((response) => {
    deptOptions.value = response;
  });
}
/** 查询用户列表 */
function getList() {
  loading.value = true;
  listUser(proxy.addDateRange(queryParams.value, dateRange.value)).then(
    (res) => {
      loading.value = false;
      userList.value = res.list;
      total.value = res.total;
    }
  );
}
/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.dept_id = data.dept_id;
  handleQuery();
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.page_num = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  queryParams.value.dept_id = undefined,
  proxy.resetForm('queryRef');
  handleQuery();
}
/** 删除按钮操作 */
function handleDelete(row) {
  const user_id = row.id ? [row.id] : ids.value;
  const user_name = row.id ? row.user_name : user_names.value;
  proxy.$modal
    .confirm('是否确认删除用户为"' + user_name + '"的数据项？')
    .then(function () {
      return delUser({user_id});
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
    'system/user/export',
    {
      ...queryParams.value,
    },
    `user_${new Date().getTime()}.xlsx`
  );
}
/** 用户状态修改  */
function handleStatusChange(row) {
  let text = row.user_status === '1' ? '启用' : '停用';
  proxy.$modal
    .confirm('确认要"' + text + '""' + row.user_name + '"用户吗?')
    .then(function () {
      return changeUserStatus(row.id, row.user_status);
    })
    .then(() => {
      proxy.$modal.msgSuccess(text + '成功');
    })
    .catch(function () {
      row.user_status = row.user_status === '0' ? '1' : '0';
    });
}
/** 更多操作 */
function handleCommand(command, row) {
  switch (command) {
    case 'handleResetPwd':
      handleResetPwd(row);
      break;
    case 'handleAuthRole':
      handleAuthRole(row);
      break;
    default:
      break;
  }
}
/** 跳转角色分配 */
function handleAuthRole(row) {
  const userId = row.id;
  router.push('/system/user-auth/role/' + userId);
}
/** 重置密码按钮操作 */
function handleResetPwd(row) {
  proxy
    .$prompt('请输入"' + row.user_name + '"的新密码', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnClickModal: false,
      inputPattern: /^.{5,20}$/,
      inputErrorMessage: '用户密码长度必须介于 5 和 20 之间',
    })
    .then(({ value }) => {
      resetUserPwd(row.id, value).then((response) => {
        proxy.$modal.msgSuccess('修改成功，新密码是：' + value);
      });
    })
    .catch(() => {});
}
/** 选择条数  */
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.id);
  user_names.value = selection.map((item) => item.user_name);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
/** 导入按钮操作 */
// function handleImport() {
//   upload.title = '用户导入';
//   upload.open = true;
// }
/** 下载模板操作 */
// function importTemplate() {
//   proxy.download(
//     'system/user/importTemplate',
//     {},
//     `user_template_${new Date().getTime()}.xlsx`
//   );
// }
/**文件上传中处理 */
// const handleFileUploadProgress = (event, file, fileList) => {
//   upload.isUploading = true;
// };
/** 文件上传成功处理 */
// const handleFileSuccess = (response, file, fileList) => {
//   upload.open = false;
//   upload.isUploading = false;
//   proxy.$refs['uploadRef'].clearFiles();
//   proxy.$alert(
//     "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
//       response.msg +
//       '</div>',
//     '导入结果',
//     { dangerouslyUseHTMLString: true }
//   );
//   getList();
// };
/** 提交上传文件 */
// function submitFileForm() {
//   proxy.$refs['uploadRef'].submit();
// }
/** 初始化部门数据 */
function initTreeData() {
  // 判断部门的数据是否存在，存在不获取，不存在则获取
  if (deptOptions.value === undefined) {
    treeselect().then((response) => {
      deptOptions.value = response;
    });
  }
}
/** 重置操作表单 */
function reset() {
  form.value = {
    id: undefined,
    dept_id: undefined,
    user_name: undefined,
    user_nickname: undefined,
    user_password: undefined,
    phone_num: undefined,
    user_email: undefined,
    sex: undefined,
    user_status: '1',
    remark: undefined,
    post_ids: [],
    role_ids: [],
  };
  proxy.resetForm('userRef');
}
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}
/** 新增按钮操作 */
function handleAdd() {
  reset();
  initTreeData();
  get_options();
  open.value = true;
  title.value = '添加用户';
  form.value.user_password = initPassword.value;
}
/** 修改按钮操作 */
async function handleUpdate(row) {
  reset();
  initTreeData();
  const user_id = row.id || ids.value[0];
  const user = await getUser({ user_id });
  form.value = user.user_info;
  form.value.post_ids = user.post_ids;
  form.value.role_ids = user.role_ids;
  get_options(); //获取选项
  open.value = true;
  title.value = '修改用户';
  form.password = '';
}

// 获取选项
async function get_options() {
  let queryParams = {
    page_num: 1,
    page_size: 999999999,
  };
  const { list: posts } = await listPost(queryParams);
  const { list: roles } = await listRole(queryParams);
  postOptions.value = posts;
  roleOptions.value = roles;
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs['userRef'].validate((valid) => {
    if (valid) {
      if (form.value.id != undefined) {
        updateUser(form.value).then((response) => {
          proxy.$modal.msgSuccess('修改成功');
          open.value = false;
          getList();
        });
      } else {
        addUser(form.value).then((response) => {
          proxy.$modal.msgSuccess('新增成功');
          open.value = false;
          getList();
        });
      }
    }
  });
}

getTreeselect();
getList();
</script>
