<template>
  <div class="app-container">
    <h4 class="form-header h4">基本信息</h4>
    <el-form :model="form" label-width="80px">
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="用户昵称" prop="user_nickname">
            <el-input v-model="form.user_nickname" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="登录账号" prop="user_name">
            <el-input v-model="form.user_name" disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <h4 class="form-header h4">角色信息</h4>
    <el-table
      v-loading="loading"
      :row-key="getRowKey"
      @row-click="clickRow"
      ref="roleRef"
      @selection-change="handleSelectionChange"
      :data="roles.slice((page_num - 1) * page_size, page_num * page_size)"
    >
      <el-table-column label="序号" type="index" align="center">
        <template #default="scope">
          <span>{{ (page_num - 1) * page_size + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        type="selection"
        :reserve-selection="true"
        width="55"
      ></el-table-column>
      <el-table-column
        label="角色编号"
        align="center"
        prop="role_id"
        width="100"
        show-overflow-tooltip
      />
      <el-table-column label="角色名称" align="center" prop="role_name" />
      <el-table-column label="权限字符" align="center" prop="role_key" />
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
      v-model:page="page_num"
      v-model:limit="page_size"
    />

      <el-form label-width="100px">
         <div style="text-align: center;margin-left:-120px;margin-top:30px;">
            <el-button type="primary" @click="submitForm()">提交</el-button>
            <el-button @click="close()">返回</el-button>
         </div>
      </el-form>
   </div>
</template>

<script setup name="AuthRole">
import { getUser, updateAuthRole } from '@/api/system/user';
import { listRole } from '@/api/system/role';

const route = useRoute();
const { proxy } = getCurrentInstance();

const loading = ref(true);
const total = ref(0);
const page_num = ref(1);
const page_size = ref(10);
const roleIds = ref([]);
const roles = ref([]);
const form = ref({
  nickName: undefined,
  userName: undefined,
  userId: undefined,
});

/** 单击选中行数据 */
function clickRow(row) {
  proxy.$refs['roleRef'].toggleRowSelection(row);
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  roleIds.value = selection.map((item) => item.role_id);
}
/** 保存选中的数据编号 */
function getRowKey(row) {
  return row.role_id;
}
/** 关闭按钮 */
function close() {
  proxy.$router.back();
  proxy.$tab.closeOpenPage();
}
/** 提交按钮 */
function submitForm() {
  const user_id = form.value.id;
  const role_ids = roleIds.value;
  updateAuthRole({ user_id, role_ids }).then((response) => {
    proxy.$modal.msgSuccess('授权成功');
    close()
  });
}

async function init() {
  const user_id = route.params && route.params.userId;
  const queryParams = {
    page_num: 1,
    page_size: 9999999999,
  };
  if (user_id) {
    loading.value = true;
    const roles_data = await listRole(queryParams);
    roles.value = roles_data.list;
    total.value = roles_data.total;
    const user = await getUser({ user_id });
    form.value = user.user_info;
    const role_ids = user.role_ids;

    nextTick(() => {
      roles.value.forEach((row) => {
        if (role_ids.includes(row.role_id)) {
          proxy.$refs['roleRef'].toggleRowSelection(row);
        }
      });
    });

    loading.value = false;
  }
}
init();
</script>
