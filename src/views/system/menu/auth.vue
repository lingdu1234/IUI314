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
      <el-table-column
        label="菜单名称"
        align="center"
        prop="menu_name"
        show-overflow-tooltip
      />
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
            :value="scope.row.data_scope"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="数据库">
        <template #default="scope">
          <el-popover
            placement="top-start"
            title="数据库"
            trigger="hover"
            :width="get_max_length(scope.row.dbs) * 9 + 5"
          >
            <template #reference>
              <span>
                {{
                  scope.row.dbs.length > 1
                    ? scope.row.dbs[0] + ' ↑ '
                    : scope.row.dbs.length == 0
                    ? ''
                    : scope.row.dbs[0]
                }}</span
              >
            </template>
            <li v-for="it in scope.row.dbs" :key="it">{{ it }}</li>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="APIs" width="200">
        <template #default="scope">
          <el-popover
            placement="top-start"
            title="APIs"
            trigger="hover"
            :width="get_max_length(scope.row.apis) * 9 + 5"
          >
            <template #reference>
              <span>
                {{
                  scope.row.apis.length > 1
                    ? scope.row.apis[0] + ' ↑ '
                    : scope.row.apis.length == 0
                    ? ''
                    : scope.row.apis[0]
                }}</span
              >
            </template>
            <li v-for="it in scope.row.apis" :key="it">{{ it }}</li>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="日志" align="center" prop="log_method">
        <template #default="scope">
          <dict-tag :options="api_log_method" :value="scope.row.log_method" />
        </template>
      </el-table-column>
      <el-table-column label="缓存" align="center" prop="data_cache_method">
        <template #default="scope">
          <div v-if="scope.row.method !== 'GET'"></div>
          <dict-tag
            v-else
            :options="api_cache_method"
            :value="scope.row.data_cache_method"
          />
        </template>
      </el-table-column>
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
      width="680px"
      append-to-body
    >
      <el-form ref="menuRef" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联数据表">
              <el-checkbox-group v-model="db_checkList">
                <el-checkbox
                  style="width: 150px"
                  v-for="dict in db"
                  :label="dict.value"
                  :key="dict.value"
                >
                  <el-tooltip
                    :content="dict.label + ' : ' + dict.value"
                    placement="top"
                  >
                    {{ dict.value }}
                  </el-tooltip>
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip placement="top">
                    <template #content>
                      <div>
                        日志记录方式:
                        <br />分为四种方式: <br />不记录 <br />文件记录
                        <br />数据库记录 <br />文件+数据库记录
                      </div>
                    </template>
                    <el-icon><info-filled /></el-icon>
                  </el-tooltip>
                  日志记录
                </span>
              </template>
              <el-select v-model="log_method" placeholder="日志记录方式">
                <el-option
                  v-for="dict in api_log_method"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="api_method === 'GET'" :span="12">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip placement="top">
                    <template #content>
                      <div>
                        日志记录方式:
                        <br />分为三种方式:
                        <br />不缓存:每次都从数据库获取，用于经常更新的数据
                        <br />按访问人:用于缓存每个人访问数据都不同的数据
                        <br />公共缓存:用于数据更新较少，不区分个人的数据
                      </div>
                    </template>
                    <el-icon><info-filled /></el-icon>
                  </el-tooltip>
                  缓存方式
                </span>
              </template>
              <el-select v-model="data_cache_method" placeholder="缓存方式">
                <el-option
                  v-for="dict in api_cache_method"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
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
  </div>
</template>

<script setup name="auth_list">
import { listAuthMenu, updateLogAndCacheMethod } from '@/api/system/menu';
import { addEditApiDb, getApiDb } from '@/api/system/api_db';

const { proxy } = getCurrentInstance();
const {
  sys_normal_disable,
  sys_api_method,
  db,
  api_cache_method,
  api_log_method,
} = proxy.useDict(
  'sys_normal_disable',
  'sys_api_method',
  'db',
  'api_cache_method',
  'api_log_method'
);
const menuList = ref([]);
const db_checkList = ref([]);
const api_id = ref('');
const api_method = ref('');
const loading = ref(true);
const open_db_relation = ref(false);
const data_cache_method = ref(null);
const log_method = ref(null);
const showSearch = ref(true);
const total = ref(0);
const title = ref('');

const data = reactive({
  queryParams: {
    page_num: 1,
    page_size: 10,
    menu_name: undefined,
    status: undefined,
    menu_type: 'F',
  },
});

const { queryParams } = toRefs(data);

function get_max_length(v) {
  let l = 0;
  v.forEach((element) => {
    l = Math.max(l, element.length);
  });
  return l;
}

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
  data_cache_method.value = row.data_cache_method;
  log_method.value = row.log_method;
  api_method.value = row.method;
  const res = await getApiDb({ api_id: api_id.value });
  db_checkList.value = res.map((item) => item.db);
  open_db_relation.value = true;
  title.value = row.menu_name + '  数据库关联+日志+缓存';
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
  const api_data = {
    api_id: api_id.value,
    dbs: db_checkList.value,
  };
  const cache_log_data = {
    id: api_id.value,
    data_cache_method: data_cache_method.value,
    log_method: log_method.value,
  };
  await Promise.all([
    addEditApiDb(api_data),
    updateLogAndCacheMethod(cache_log_data),
  ]);
  proxy.$modal.msgSuccess('数据关联更新成功');
  open_db_relation.value = false;
  getList();
}

getList();
</script>
