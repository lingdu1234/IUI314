<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
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
      <el-form-item label="方法" prop="method">
        <el-select
          v-model="queryParams.method"
          placeholder="菜单状态"
          clearable
        >
          <el-option
            v-for="dict in sys_api_method"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="menuList">
      <el-table-column
        label="菜单编号"
        align="center"
        width="100"
        show-overflow-tooltip
        prop="order_sort"
      />
      <el-table-column label="菜单名称" align="center" prop="menu_name" />
      <el-table-column label="菜单api" align="center" prop="api" />
      <el-table-column label="请求方法" align="center" prop="method">
        <template #default="scope">
          <dict-tag :options="sys_api_method" :value="scope.row.method" />
        </template>
      </el-table-column>
      <el-table-column prop="method" label="数据权限" width="80">
        <template #default="scope">
          <dict-tag
            v-if="scope.row.method == 'GET'"
            :options="sys_normal_disable"
            :value="scope.row.is_data_scope"
          />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
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
        width="200"
        class-name="small-padding fixed-width"
        v-hasPermi="['system/menu/delete']"
      >
        <template #default="scope">
          <el-tooltip
            v-if="scope.row.menu_type == 'F'"
            content="数据库关联"
            placement="top"
          >
            <el-button
              style="color: green"
              v-hasPermi="['system/menu/delete']"
              type="text"
              icon="DataBoard"
              @click="handleDbRelation(scope.row)"
              >数据库</el-button
            >></el-tooltip
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
    <!-- 添加或修改权限数据对话框 -->
    <el-dialog
      :title="title"
      v-model="open_db_relation"
      width="600px"
      append-to-body
    >
      <h3>请选择api影响数据库</h3>
      <el-checkbox-group v-model="db_checkList">
        <el-checkbox v-for="dict in db" :label="dict.value" :key="dict.value">
          <el-tooltip
            :content="dict.label + ' : ' + dict.value"
            placement="top"
          >
            {{ dict.value }}
          </el-tooltip>
        </el-checkbox>
      </el-checkbox-group>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="auth_list">
import { listAuthMenu } from '@/api/system/menu';
import { addEditApiDb, getApiDb } from '@/api/system/api_db';

const { proxy } = getCurrentInstance();
const { sys_normal_disable, sys_api_method, db } = proxy.useDict(
  'sys_normal_disable',
  'sys_api_method',
  'db'
);
const menuList = ref([]);
const db_checkList = ref([]);
const api_id = ref('');
const loading = ref(true);
const open_db_relation = ref(false);
const showSearch = ref(true);
const total = ref(0);
const title = ref('');

const data = reactive({
  queryParams: {
    page_num: 1,
    page_size: 10,
    menu_name: undefined,
    status: undefined,
  },
});

const { queryParams } = toRefs(data);

/** 查询岗位列表 */
function getList() {
  loading.value = true;
  listAuthMenu(queryParams.value).then((response) => {
    menuList.value = response.list;
    total.value = response.total;
    loading.value = false;
  });
}

async function handleDbRelation(row) {
  api_id.value = row.id;
  const res = await getApiDb({ api_id: api_id.value });
  db_checkList.value = res.map((item) => item.db);
  open_db_relation.value = true;
  title.value = '数据库关联';
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.page_num = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm('queryRef');
  handleQuery();
}

function cancel() {
  open_db_relation.value = false;
}

/** 提交按钮 */
async function submitForm() {
  let data = {
    api_id: api_id.value,
    dbs: db_checkList.value,
  }
  await addEditApiDb(data);
  proxy.$modal.msgSuccess('数据库关联更新成功');
  open_db_relation.value = false;
}

getList();
</script>
