<template>
  <!-- 授权用户 -->
  <el-dialog
    title="选择用户"
    v-model="visible"
    width="800px"
    top="5vh"
    append-to-body
  >
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item label="用户名称" prop="user_name">
        <el-input
          v-model="queryParams.user_name"
          placeholder="请输入用户名称"
          clearable
          size="small"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone_num">
        <el-input
          v-model="queryParams.phone_num"
          placeholder="请输入手机号码"
          clearable
          size="small"
          @keyup.enter="handleQuery"
        />
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
    <el-row>
      <el-table
        @row-click="clickRow"
        ref="refTable"
        :data="userList"
        @selection-change="handleSelectionChange"
        height="260px"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          label="用户名称"
          prop="user_name"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="用户昵称"
          prop="user_nickname"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="邮箱"
          prop="user_email"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="手机"
          prop="phone_num"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="状态" align="center" prop="user_status">
          <template #default="scope">
            <dict-tag
              :options="sys_normal_disable"
              :value="scope.row.user_status"
            />
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
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.page_num"
        v-model:limit="queryParams.page_size"
        @pagination="getList"
      />
    </el-row>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSelectUser">确 定</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="SelectUser">
import { authUserSelectAll, unallocatedUserList } from '@/api/system/role';

const props = defineProps({
  role_id: {
    type: [Number, String],
  },
});

const { proxy } = getCurrentInstance();
const { sys_normal_disable } = proxy.useDict('sys_normal_disable');

const userList = ref([]);
const visible = ref(false);
const total = ref(0);
const userIds = ref([]);

const queryParams = reactive({
  page_num: 1,
  page_size: 10,
  role_id: undefined,
  user_name: undefined,
  phone_num: undefined,
});

// 显示弹框
function show() {
  queryParams.role_id = props.role_id;
  getList();
  visible.value = true;
}
/**选择行 */
function clickRow(row) {
  proxy.$refs['refTable'].toggleRowSelection(row);
}
// 多选框选中数据
function handleSelectionChange(selection) {
  userIds.value = selection.map((item) => item.id);
}
// 查询表数据
async function getList() {
  const res = await unallocatedUserList(queryParams);
  userList.value = res.list;
  total.value = res.total;
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.page_num = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm('queryRef');
  handleQuery();
}
const emit = defineEmits(['ok']);
/** 选择授权用户操作 */
function handleSelectUser() {
  const role_id = queryParams.role_id;
  const user_ids = userIds.value;
  if (user_ids.length === 0) {
    proxy.$modal.msgError('请选择要分配的用户');
    return;
  }
  authUserSelectAll({ role_id, user_ids }).then((res) => {
    proxy.$modal.msgSuccess('授权成功');
    visible.value = false;
    emit('ok');
  });
}

defineExpose({
  show,
});
</script>
