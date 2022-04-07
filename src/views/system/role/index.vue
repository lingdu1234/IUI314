<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      v-show="showSearch"
      :inline="true"
    >
      <el-form-item label="角色名称" prop="role_name">
        <el-input
          v-model="queryParams.role_name"
          placeholder="请输入角色名称"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="权限字符" prop="role_key">
        <el-input
          v-model="queryParams.role_key"
          placeholder="请输入权限字符"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="角色状态"
          clearable
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
          style="width: 240px"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
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
          v-hasPermi="['system/role/add']"
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
          v-hasPermi="['system/role/edit']"
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
          v-hasPermi="['system/role/delete']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['system/role/export']"
          >导出</el-button
        >
      </el-col>

      <right-toolbar>
        v-model:showSearch="showSearch" @queryTable="getList" ></right-toolbar
      >
    </el-row>

    <!-- 表格数据 -->
    <el-table
      v-loading="loading"
      :data="roleList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="角色编号"
        prop="role_id"
        width="120"
        show-overflow-tooltip
      />
      <el-table-column
        label="角色名称"
        prop="role_name"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column
        label="权限字符"
        prop="role_key"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column label="显示顺序" prop="list_order" width="100" />
      <el-table-column label="状态" align="center" width="100">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="1"
            inactive-value="0"
            @change="handleStatusChange(scope.row)"
            :disabled="!checkPermi(['system/role/change_status'])"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="created_at"
        width="160"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.created_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
         v-hasPermi="['system/role/edit','system/role/delete','system/role/set_data_scope']"
      >
        <template #default="scope">
          <el-tooltip content="修改" placement="top">
            <el-button
              v-if="scope.row.role_id !== 1"
              type="text"
              icon="Edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system/role/edit']"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button
              v-if="scope.row.role_id !== 1"
              type="text"
              icon="Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system/role/delete']"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="数据权限" placement="top">
            <el-button
              type="text"
              icon="CircleCheck"
              @click="handleDataScope(scope.row)"
              v-hasPermi="['system/role/set_data_scope']"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="分配用户" placement="top">
            <el-button
              v-if="scope.row.role_id !== 1"
              type="text"
              icon="User"
              @click="handleAuthUser(scope.row)"
              v-hasPermi="['system/role/add_auth_user','system/role/cancel_auth_user']"
            ></el-button>
          </el-tooltip>
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

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="roleRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="role_name">
          <el-input v-model="form.role_name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item prop="role_key">
          <template #label>
            <span>
              <el-tooltip
                content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)"
                placement="top"
              >
                <el-icon><info-filled /></el-icon>
              </el-tooltip>
              权限字符
            </span>
          </template>
          <el-input v-model="form.role_key" placeholder="请输入权限字符" />
        </el-form-item>
        <el-form-item label="角色顺序" prop="list_order">
          <el-input-number
            v-model="form.list_order"
            controls-position="right"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
              >{{ dict.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-checkbox
            v-model="menuExpand"
            @change="handleCheckedTreeExpand($event, 'menu')"
            >展开/折叠</el-checkbox
          >
          <el-checkbox
            v-model="menuNodeAll"
            @change="handleCheckedTreeNodeAll($event, 'menu')"
            >全选/全不选</el-checkbox
          >
          <el-checkbox
            v-model="form.menuCheckStrictly"
            @change="handleCheckedTreeConnect($event, 'menu')"
            >父子联动</el-checkbox
          >
          <el-tree
            class="tree-border"
            :data="menuOptions"
            show-checkbox
            ref="menuRef"
            node-key="id"
            :check-strictly="!form.menuCheckStrictly"
            empty-text="加载中，请稍候"
            :props="{ label: 'menu_name', children: 'children' }"
          ></el-tree>
        </el-form-item>
        <el-form-item label="备注">
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

    <!-- 分配角色数据权限对话框 -->
    <el-dialog
      :title="title"
      v-model="openDataScope"
      width="500px"
      append-to-body
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.role_name" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限字符">
          <el-input v-model="form.role_key" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限范围">
          <el-select v-model="form.data_scope" @change="dataScopeSelectChange">
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据权限" v-show="form.data_scope == 2">
          <el-checkbox
            v-model="deptExpand"
            @change="handleCheckedTreeExpand($event, 'dept')"
            >展开/折叠</el-checkbox
          >
          <el-checkbox
            v-model="deptNodeAll"
            @change="handleCheckedTreeNodeAll($event, 'dept')"
            >全选/全不选</el-checkbox
          >
          <el-checkbox
            v-model="form.deptCheckStrictly"
            disabled
            @change="handleCheckedTreeConnect($event, 'dept')"
            >父子联动</el-checkbox
          >
          <el-tree
            class="tree-border"
            :data="deptOptions"
            show-checkbox
            default-expand-all
            ref="deptRef"
            node-key="dept_id"
            :check-strictly="!form.deptCheckStrictly"
            empty-text="加载中，请稍候"
            :props="{ label: 'dept_name', children: 'children' }"
          ></el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitDataScope">确 定</el-button>
          <el-button @click="cancelDataScope">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Role">
import { getCurrentInstance,ref,toRefs,nextTick,reactive } from 'vue';
import { useRouter } from 'vue-router';
import {
  addRole,
  changeRoleStatus,
  dataScope,
  delRole,
  getRole,
  listRole,
  updateRole,
  getRoleMenus,
  getRoleDepts,
} from '@/api/system/role';
import { treeselect as menuTreeselect } from '@/api/system/menu';
import { treeselect as deptTreeselect } from '@/api/system/dept';
import { checkPermi } from "@/utils/permission"; 

const router = useRouter();
const { proxy } = getCurrentInstance();
const { sys_normal_disable } = proxy.useDict('sys_normal_disable');

const roleList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const role_names = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref('');
const dateRange = ref([]);
const menuOptions = ref([]);
const menuExpand = ref(false);
const menuNodeAll = ref(false);
const deptExpand = ref(true);
const deptNodeAll = ref(false);
const deptOptions = ref([]);
const openDataScope = ref(false);
const menuRef = ref(null);
const deptRef = ref(null);

/** 数据范围选项*/
const dataScopeOptions = ref([
  { value: '1', label: '全部数据权限' },
  { value: '2', label: '自定数据权限' },
  { value: '3', label: '本部门数据权限' },
  { value: '4', label: '本部门及以下数据权限' },
  { value: '5', label: '仅本人数据权限' },
]);

const data = reactive({
  form: {},
  queryParams: {
    page_num: 1,
    page_size: 10,
    role_name: undefined,
    role_key: undefined,
    status: undefined,
  },
  rules: {
    role_name: [
      { required: true, message: '角色名称不能为空', trigger: 'blur' },
    ],
    role_key: [
      { required: true, message: '权限字符不能为空', trigger: 'blur' },
    ],
    list_order: [
      { required: true, message: '角色顺序不能为空', trigger: 'blur' },
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询角色列表 */
const getList = async () => {
  loading.value = true;
  const response = await listRole(
    proxy.addDateRange(queryParams.value, dateRange.value)
  );
  roleList.value = response.list;
  total.value = response.total;
  loading.value = false;
};
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.page_num = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  proxy.resetForm('queryRef');
  handleQuery();
}
/** 删除按钮操作 */
function handleDelete(row) {
  const role_ids = row.role_id ? [row.role_id] : ids.value;
  const roleNames = row.role_id ? row.role_name : role_names.value;
  proxy.$modal
    .confirm('是否确认删除角色编号为"' + roleNames + '"的数据项?')
    .then(function () {
      return delRole({ role_ids });
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
    'system/role/export',
    {
      ...queryParams.value,
    },
    `role_${new Date().getTime()}.xlsx`
  );
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.role_id);
  role_names.value = selection.map((item) => item.role_name);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
/** 角色状态修改 */
function handleStatusChange(row) {
  let text = row.status === '1' ? '启用' : '停用';
  proxy.$modal
    .confirm('确认要"' + text + '""' + row.role_name + '"角色吗?')
    .then(function () {
      return changeRoleStatus(row.role_id, row.status);
    })
    .then(() => {
      proxy.$modal.msgSuccess(text + '成功');
    })
    .catch(function () {
      row.status = row.status === '0' ? '1' : '0';
    });
}
/** 分配用户 */
function handleAuthUser(row) {
  router.push('/system/role-auth/user/' + row.role_id);
}
/** 查询菜单树结构 */
async function getMenuTreeselect() {
  menuOptions.value = await menuTreeselect();
}

/** 查询菜单树结构 */
const getDeptTreeselect = async () => {
  deptOptions.value = await deptTreeselect();
};
/** 所有部门节点数据 */
function getDeptAllCheckedKeys() {
  // 目前被选中的部门节点
  let checkedKeys = deptRef.value.getCheckedKeys();
  // 半选中的部门节点
  let halfCheckedKeys = deptRef.value.getHalfCheckedKeys();
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
}
/** 重置新增的表单以及其他数据  */
function reset() {
  if (menuRef.value != undefined) {
    menuRef.value.setCheckedKeys([]);
  }
  menuExpand.value = false;
  menuNodeAll.value = false;
  deptExpand.value = true;
  deptNodeAll.value = false;
  form.value = {
    role_id: undefined,
    role_name: undefined,
    role_key: undefined,
    list_order: 0,
    status: '1',
    menu_ids: [],
    dept_ids: [],
    menuCheckStrictly: true,
    deptCheckStrictly: false,
    remark: undefined,
  };
  proxy.resetForm('roleRef');
}
/** 添加角色 */
async function handleAdd() {
  reset();
  await getMenuTreeselect();
  open.value = true;
  title.value = '添加角色';
}
/** 修改角色 */
async function handleUpdate(row) {
  reset();
  const role_id = row.role_id || ids.value[0];
  await getMenuTreeselect();
  const roleMenu = await getRoleMenus({ role_id });
  const response = await getRole({ role_id });
  form.value = response;
  form.value.menuCheckStrictly = true;
  form.value.list_order = Number(form.value.list_order);
  open.value = true;
  roleMenu.forEach((v) => {
    nextTick(() => {
      menuRef.value.setChecked(v, true, false);
    });
  });
  title.value = '修改角色';
}

/** 树权限（展开/折叠）*/
function handleCheckedTreeExpand(value, type) {
  if (type == 'menu') {
    let treeList = menuOptions.value;
    for (let i = 0; i < treeList.length; i++) {
      menuRef.value.store.nodesMap[treeList[i].id].expanded = value;
    }
  } else if (type == 'dept') {
    let treeList = deptOptions.value;
    for (let i = 0; i < treeList.length; i++) {
      deptRef.value.store.nodesMap[treeList[i].id].expanded = value;
    }
  }
}
/** 树权限（全选/全不选） */
function handleCheckedTreeNodeAll(value, type) {
  if (type == 'menu') {
    menuRef.value.setCheckedNodes(value ? menuOptions.value : []);
  } else if (type == 'dept') {
    deptRef.value.setCheckedNodes(value ? deptOptions.value : []);
  }
}
/** 树权限（父子联动） */
function handleCheckedTreeConnect(value, type) {
  if (type == 'menu') {
    form.value.menuCheckStrictly = value ? true : false;
  } else if (type == 'dept') {
    form.value.deptCheckStrictly = value ? true : false;
  }
}
/** 所有菜单节点数据 */
function getMenuAllCheckedKeys() {
  // 目前被选中的菜单节点
  let checkedKeys = menuRef.value.getCheckedKeys();
  // 半选中的菜单节点
  let halfCheckedKeys = menuRef.value.getHalfCheckedKeys();
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
}
/** 提交按钮 */
async function submitForm() {
  proxy.$refs['roleRef'].validate(async (valid) => {
    if (valid) {
      if (form.value.role_id != undefined) {
        form.value.menu_ids = getMenuAllCheckedKeys();
        await updateRole(form.value);
        proxy.$modal.msgSuccess('修改成功');
        open.value = false;
        getList();
      } else {
        form.value.menu_ids = getMenuAllCheckedKeys();
        await addRole(form.value);
        proxy.$modal.msgSuccess('新增成功');
        open.value = false;
        getList();
      }
    }
  });
}
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}
/** 选择角色权限范围触发 */
function dataScopeSelectChange(value) {
  if (value !== '2') {
    deptRef.value.setCheckedKeys([]);
  }
}
/** 分配数据权限操作 */
async function handleDataScope(row) {
  reset();
  const role_id = row.role_id;
  await getDeptTreeselect();
  const roleDepts = await getRoleDepts({ role_id });
  const response = await getRole({ role_id });
  form.value = response;
  form.value.deptCheckStrictly = false;
  openDataScope.value = true;
  nextTick(() => {
    if (deptRef.value) {
      deptRef.value.setCheckedKeys(roleDepts);
    }
  });
  title.value = '分配数据权限';
}
/** 提交按钮（数据权限） */
async function submitDataScope() {
  if (form.value.role_id != undefined) {
    form.value.dept_ids = getDeptAllCheckedKeys();
    await dataScope(form.value);
    proxy.$modal.msgSuccess('修改成功');
    openDataScope.value = false;
    getList();
  }
}
/** 取消按钮（数据权限）*/
function cancelDataScope() {
  openDataScope.value = false;
  reset();
}

getList();
</script>
