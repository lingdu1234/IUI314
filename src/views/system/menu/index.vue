<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryRef"
      :model="queryParams"
      :inline="true"
    >
      <el-form-item label="菜单名称" prop="menu_name">
        <el-input
          v-model="queryParams.menu_name"
          placeholder="请输入菜单名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="菜单状态"
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
        <el-button type="primary" icon="Search" @click="handleQuery">
          搜索
        </el-button>
        <el-button icon="Refresh" @click="resetQuery">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8" style="height: 35px">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system/menu/add']"
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
        >
          新增
        </el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="info" plain icon="Sort" @click="toggleExpandAll"
          >展开/折叠</el-button
        >
      </el-col> -->
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <el-table
      v-if="show_menu_table"
      ref="menuTable"
      v-loading="loading"
      :data="menuList"
      row-key="id"
      lazy
      :load="load"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        prop="menu_name"
        label="菜单名称"
        :show-overflow-tooltip="true"
        width="200"
      />
      <el-table-column prop="icon" label="图标" align="center" width="100">
        <template #default="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column
        prop="order_sort"
        label="排序"
        width="100"
      />
      <el-table-column
        prop="api"
        label="唯一标识"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="component"
        label="组件路径"
        :show-overflow-tooltip="true"
      />
      <el-table-column prop="method" label="方法" width="80">
        <template #default="scope">
          <dict-tag :options="sys_api_method" :value="scope.row.method" />
        </template>
      </el-table-column>
      <el-table-column prop="method" label="数据权限" width="80">
        <template #default="scope">
          <dict-tag
            v-if="scope.row.method == 'GET'"
            :options="sys_normal_disable"
            :value="scope.row.data_scope"
          />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="60">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column prop="visible" label="显示" width="60">
        <template #default="scope">
          <dict-tag :options="sys_show_hide" :value="scope.row.visible" />
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="created_at"
        show-overflow-tooltip
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.created_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-hasPermi="[
          'system/menu/edit',
          'system/menu/delete',
          'system/menu/add',
        ]"
        label="操作"
        align="center"
        width="200"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-tooltip content="修改" placement="top">
            <el-button
              v-hasPermi="['system/menu/edit']"
              link
              icon="Edit"
              style="color: chocolate"
              @click="handleUpdate(scope.row)"
            />
          </el-tooltip>
          <el-tooltip content="复制" placement="top">
            <el-button
              v-hasPermi="['system/menu/add']"
              link
              icon="copy-document"
              style="color: violet"
              @click="handleAddByCopy(scope.row)"
            />
          </el-tooltip>
          <el-tooltip content="新增" placement="top">
            <el-button
              v-hasPermi="['system/menu/add']"
              link
              icon="FolderAdd"
              @click="handleAdd(scope.row)"
            />
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button
              v-hasPermi="['system/menu/delete']"
              style="color: red"
              link
              icon="Delete"
              @click="handleDelete(scope.row)"
            />
          </el-tooltip>
          <el-tooltip
            v-if="scope.row.menu_type == 'F'"
            content="数据库关联"
            placement="top"
          >
            <el-button
              v-hasPermi="['system/menu/delete']"
              style="color: green"
              link
              icon="DataBoard"
              @click="handleDbRelation(scope.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog
      v-model="open"
      :title="title"
      width="680px"
      :before-close="handleClose"
      append-to-body
    >
      <el-form ref="menuRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <tree-select
                v-model:value="form.pid"
                :options="menuOptions"
                :obj-map="{
                  value: 'id',
                  label: 'menu_name',
                  children: 'children',
                }"
                placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menu_type">
              <el-radio-group v-model="form.menu_type">
                <el-radio label="M">
                  目录
                </el-radio>
                <el-radio label="C">
                  菜单
                </el-radio>
                <el-radio label="F">
                  api/按钮
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="form.menu_type != 'F'" :span="24">
            <el-form-item label="菜单图标" prop="icon">
              <el-popover
                v-model:visible="showChooseIcon"
                placement="bottom-start"
                :width="540"
                trigger="click"
                @show="showSelectIcon"
              >
                <template #reference>
                  <el-input
                    v-model="form.icon"
                    placeholder="点击选择图标"
                    readonly
                    @click="showSelectIcon"
                  >
                    <template #prefix>
                      <svg-icon
                        v-if="form.icon"
                        :icon-class="form.icon"
                        class="el-input__icon"
                        style="height: 32px; width: 16px"
                      />
                      <el-icon v-else style="height: 32px; width: 16px">
                        <search />
                      </el-icon>
                    </template>
                  </el-input>
                </template>
                <icon-select ref="iconSelectRef" @selected="selected" />
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menu_name">
              <el-input v-model="form.menu_name" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="order_sort">
              <el-input-number
                v-model="form.order_sort"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="form.menu_type != 'F'" :span="12">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip
                    content="选择是外链则路由地址需要以`http(s)://`开头"
                    placement="top"
                  >
                    <el-icon><info-filled /></el-icon> </el-tooltip>是否外链
                </span>
              </template>
              <el-radio-group v-model="form.is_frame">
                <el-radio label="1">
                  是
                </el-radio>
                <el-radio label="0">
                  否
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="form.menu_type != 'F'" :span="12">
            <el-form-item prop="path">
              <template #label>
                <span>
                  <el-tooltip
                    content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
                    placement="top"
                  >
                    <el-icon><info-filled /></el-icon>
                  </el-tooltip>
                  路由地址
                </span>
              </template>
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.menu_type == 'C'" :span="12">
            <el-form-item prop="component">
              <template #label>
                <span>
                  <el-tooltip
                    content="访问的组件路径，如：`system/user/index`，默认在`views`目录下"
                    placement="top"
                  >
                    <el-icon><info-filled /></el-icon>
                  </el-tooltip>
                  组件路径
                </span>
              </template>
              <el-input v-model="form.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="api">
              <el-input
                v-model="form.api"
                placeholder="请输入唯一标识"
                maxlength="100"
              />
              <template #label>
                <span>
                  <el-tooltip
                    v-if="form.menu_type == 'M'"
                    content="目录的唯一标志，建议格式M-name，如：`M-sys`,`M-system-menu`"
                    placement="top"
                  >
                    <el-icon><info-filled /></el-icon>
                  </el-tooltip>
                  <el-tooltip
                    v-else-if="form.menu_type == 'C'"
                    content="菜单唯一标志，同目录标志，如：`M-system-menu`"
                    placement="top"
                  >
                    <el-icon><info-filled /></el-icon>
                  </el-tooltip>
                  <el-tooltip
                    v-else-if="form.menu_type == 'F'"
                    content="API/按钮的唯一标志，可为API,如：`system/user/add`,若只是单纯控制按钮显示，建议B-name，如：`B-export`"
                    placement="top"
                  >
                    <el-icon><info-filled /></el-icon>
                  </el-tooltip>
                  <span v-if="form.menu_type == 'M'">目录标志</span>
                  <span v-else-if="form.menu_type == 'C'">菜单API</span>
                  <span v-else-if="form.menu_type == 'F'">api标志</span>
                </span>
              </template>
            </el-form-item>
          </el-col>
          <el-col v-if="form.menu_type == 'F'" :span="12">
            <el-form-item prop="method">
              <template #label>
                <span>
                  <el-tooltip
                    content="API 请求方法，如：`GET`,`POST`，`PUT`,`DELETE`"
                    placement="top"
                  >
                    <el-icon><info-filled /></el-icon>
                  </el-tooltip>
                  请求方法
                </span>
              </template>
              <el-select v-model="form.method" placeholder="请求方法" clearable>
                <el-option
                  v-for="dict in sys_api_method"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            v-if="form.menu_type == 'F' && form.method == 'GET'"
            :span="12"
          >
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip placement="top">
                    <template #content>
                      <div>
                        日志记录方式:
                        <br>分为三种方式:
                        <br>不缓存:每次都从数据库获取，用于经常更新的数据
                        <br>按访问人:用于缓存每个人访问数据都不同的数据
                        <br>公共缓存:用于数据更新较少，不区分个人的数据
                      </div>
                    </template>
                    <el-icon><info-filled /></el-icon>
                  </el-tooltip>
                  缓存方式
                </span>
              </template>
              <el-select
                v-model="form.data_cache_method"
                placeholder="请求方法"
              >
                <el-option
                  v-for="dict in api_cache_method"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="form.menu_type == 'F'" :span="12">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip placement="top">
                    <template #content>
                      <div>
                        日志记录方式:
                        <br>分为四种方式: <br>不记录 <br>文件记录
                        <br>数据库记录 <br>文件+数据库记录
                      </div>
                    </template>
                    <el-icon><info-filled /></el-icon>
                  </el-tooltip>
                  日志记录
                </span>
              </template>
              <el-select v-model="form.log_method" placeholder="请求方法">
                <el-option
                  v-for="dict in api_log_method"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="form.menu_type == 'C'" :span="12">
            <el-form-item>
              <el-input
                v-model="form.query"
                placeholder="请输入路由参数"
                maxlength="255"
              />
              <template #label>
                <span>
                  <el-tooltip
                    content="访问路由的默认传递参数，如：`{&quot;id&quot;: 1, &quot;name&quot;: &quot;ry&quot;}`"
                    placement="top"
                  >
                    <el-icon><info-filled /></el-icon>
                  </el-tooltip>
                  路由参数
                </span>
              </template>
            </el-form-item>
          </el-col>
          <el-col v-if="form.menu_type == 'C'" :span="12">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip
                    content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致"
                    placement="top"
                  >
                    <el-icon><info-filled /></el-icon>
                  </el-tooltip>
                  是否缓存
                </span>
              </template>
              <el-radio-group v-model="form.is_cache">
                <el-radio label="1">
                  缓存
                </el-radio>
                <el-radio label="0">
                  不缓存
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col
            v-if="form.menu_type == 'F' && form.method == 'GET'"
            :span="12"
          >
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip
                    content="是否开启数据权限,开启后可以设置数据权限"
                    placement="top"
                  >
                    <el-icon><info-filled /></el-icon>
                  </el-tooltip>
                  数据权限
                </span>
              </template>
              <el-radio-group v-model="form.data_scope">
                <el-radio label="0">
                  关闭
                </el-radio>
                <el-radio label="1">
                  开启
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="form.menu_type != 'F'" :span="12">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip
                    content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问"
                    placement="top"
                  >
                    <el-icon><info-filled /></el-icon>
                  </el-tooltip>
                  显示状态
                </span>
              </template>
              <el-radio-group v-model="form.visible">
                <el-radio
                  v-for="dict in sys_show_hide"
                  :key="dict.value"
                  :label="dict.value"
                >
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="form.menu_type != 'F'" :span="12">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip
                    content="选择停用则路由将不会出现在侧边栏，也不能被访问"
                    placement="top"
                  >
                    <el-icon><info-filled /></el-icon>
                  </el-tooltip>
                  菜单状态
                </span>
              </template>
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                >
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入备注"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">
            确 定
          </el-button>
          <el-button @click="cancel">
            取 消
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Menu">
import { getCurrentInstance,nextTick ,reactive,ref,toRefs,watch} from "vue";

import {
  addMenu,
  delMenu,
  getMenu,
  listMenu,
  updateMenu,
} from "@/api/system/menu";
import IconSelect from "@/components/IconSelect";
import SvgIcon from "@/components/SvgIcon";

const { proxy } = getCurrentInstance();
const {
  sys_show_hide,
  sys_normal_disable,
  sys_api_method,
  api_cache_method,
  api_log_method,
} = proxy.useDict(
  "sys_show_hide",
  "sys_normal_disable",
  "sys_api_method",
  "api_cache_method",
  "api_log_method"
);
const menuList = ref([]);
const menuMap = ref({});
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const title = ref("");
const menuOptions = ref([]);
// const isExpandAll = ref(false);
const showChooseIcon = ref(false);
const iconSelectRef = ref(null);

const show_menu_table = ref(true);

const copy_add_id = ref(null);
const edit_pid = ref(null);

const data = reactive({
  form: {},
  queryParams: {
    menu_name: undefined,
    status: undefined,
  },
  rules: {
    menu_name: [
      { required: true, message: "菜单名称不能为空", trigger: "blur" },
    ],
    order_sort: [
      { required: true, message: "菜单顺序不能为空", trigger: "blur" },
    ],
    path: [{ required: true, message: "路由地址不能为空", trigger: "blur" }],
    api: [
      { required: true, message: "菜单的唯一标志不能为空", trigger: "blur" },
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);

// 如果方法不是GET，将数据权限重置为关闭
watch(
  () => form.value.method,
  (newV, _) => {
    if (newV !== "GET") {
      form.value.data_scope = "0";
      form.value.data_cache_method = "0";
    }
  }
);

/** 查询菜单列表 */
async function getList() {
  loading.value = true;
  const { list: data } = await listMenu(queryParams.value);
  const { mainTree, mapTree } = proxy.handleTreeLazy(data, "id", "pid");
  menuList.value = mainTree;
  menuMap.value = mapTree;
  loading.value = false;
}
// async function getList() {
//   loading.value = true;
//   const { list: data } = await listMenu(queryParams.value);
//   menuList.value = proxy.handleTree(data, 'id', 'pid');
//   loading.value = false;
// }
/** 查询菜单下拉树结构 */
async function getTreeselect() {
  menuOptions.value = [];
  const { list: data } = await listMenu(queryParams.value);
  const menu = { id: 0, menu_name: "主类目", children: [] };
  menu.children = proxy.handleTree(data, "id", "pid");
  menuOptions.value.push(menu);
}

// lazy load 表格菜单数据
const tree_map = new Map();
async function upchildrenDom(parentId) {
  let v = tree_map.get(parentId);
  if (v) {
    const { tree, treeNode, resolve } = v; //根据pid取出对应的节
    load(tree, treeNode, resolve);
  } else {
    show_menu_table.value = false;
    nextTick(() => {
      show_menu_table.value = true;
    });
  }
}
const load = (tree, treeNode, resolve) => {
  const pid = tree.id;
  tree_map.set(pid, { tree, treeNode, resolve });
  if (menuMap.value[tree.id]) {
    setTimeout(() => {
      resolve(menuMap.value[tree.id]);
    }, 1);
  } else {
    show_menu_table.value = false;
    nextTick(() => {
      show_menu_table.value = true;
    });
  }
};
/** 取消按钮 */
function cancel() {
  form.value.id = copy_add_id.value;
  open.value = false;
  reset();
}
/** 表单重置 */
function reset() {
  form.value = {
    id: undefined,
    pid: "0",
    menu_name: undefined,
    icon: undefined,
    menu_type: "M",
    order_sort: undefined,
    data_scope: "0",
    is_frame: "0",
    method: undefined,
    is_cache: "1",
    log_method: "3",
    data_cache_method: "1",
    visible: "1",
    status: "1",
    remark: "",
  };
  proxy.resetForm("menuRef");
}
/** 展示下拉图标 */
function showSelectIcon() {
  iconSelectRef.value.reset();
  showChooseIcon.value = true;
}
/** 选择图标 */
function selected(name) {
  form.value.icon = name;
  showChooseIcon.value = false;
}
/** 关闭弹窗隐藏图标选择 */
function handleClose() {
  cancel();
  showChooseIcon.value = false;
}
/** 搜索按钮操作 */
function handleQuery() {
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}
/** 新增按钮操作 */
async function handleAdd(row) {
  edit_pid.value = row.pid;
  reset();
  await getTreeselect();
  if (row != null && row.id) {
    form.value.pid = row.id;
  } else {
    form.value.pid = "0";
  }
  form.value.menu_name = row.menu_type == "C" ? row.menu_name + "-" : undefined;
  let t = undefined;
  if (row.menu_type == undefined) {
    t = "M";
  } else if (row.menu_type == "M") {
    t = "C";
  } else {
    t = "F";
  }

  form.value.menu_type = t;
  open.value = true;
  title.value = "添加菜单";
}
async function handleAddByCopy(row) {
  copy_add_id.value = row.id;
  edit_pid.value = row.pid;
  reset();
  await getTreeselect();
  form.value = row;
  form.value.id = undefined;
  open.value = true;
  title.value = "添加菜单";
}
/** 展开/折叠操作 */
// function toggleExpandAll() {
//   show_menu_table.value = false;
//   isExpandAll.value = !isExpandAll.value;
//   nextTick(() => {
//     show_menu_table.value = true;
//   });
// }
/** 修改按钮操作 */
async function handleUpdate(row) {
  edit_pid.value = row.pid;
  reset();
  await getTreeselect();
  const query_params = { id: row.id };
  const data = await getMenu(query_params);
  form.value = data;
  open.value = true;
  title.value = "修改菜单";
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["menuRef"].validate((valid) => {
    if (valid) {
      if (form.value.menu_type != "F" && form.value.api.indexOf("/") != -1) {
        proxy.$modal.msgError("格式错误，不能为api路径,不能包含/");
        return;
      }
      if (form.value.id != undefined) {
        updateMenu(form.value).then(async (response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          await getList();
          await upchildrenDom(form.value.pid);
          await upchildrenDom(edit_pid.value);
          edit_pid.value = undefined;
        });
      } else {
        addMenu(form.value).then(async (response) => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          await getList();
          await upchildrenDom(form.value.pid);
          await upchildrenDom(edit_pid.value);
          edit_pid.value = undefined;
        });
      }
    }
    copy_add_id.value = undefined;
  });
}
/** 删除按钮操作 */
function handleDelete(row) {
  const id = row.id;
  proxy.$modal
    .confirm("是否确认删除名称为\"" + row.menu_name + "\"的数据项?")
    .then(function () {
      return delMenu({ id });
    })
    .then(async () => {
      await getList();
      await upchildrenDom(form.value.pid);
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
}

getList();
</script>
