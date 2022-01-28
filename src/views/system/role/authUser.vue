<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      v-show="showSearch"
      :inline="true"
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
          @click="openSelectUser"
          v-hasPermi="['system:role:add']"
          >添加用户</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="CircleClose"
          size="mini"
          :disabled="multiple"
          @click="cancelAuthUserAll"
          v-hasPermi="['system:role:remove']"
          >批量取消授权</el-button
        >
      </el-col>
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
      :data="userList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
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
          <dict-tag :options="sys_normal_disable" :value="scope.row.user_status" />
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
      >
        <template #default="scope">
          <el-button
            size="mini"
            type="text"
            icon="CircleClose"
            @click="cancelAuthUser(scope.row)"
            v-hasPermi="['system:role:remove']"
            >取消授权</el-button
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
    <select-user
      ref="selectRef"
      :role_id="queryParams.role_id"
      @ok="handleQuery"
    />
  </div>
</template>

<script setup name="AuthUser">
import selectUser from './selectUser';
import {
  allocatedUserList,
  authUserCancel,
} from '@/api/system/role';

const route = useRoute();
const { proxy } = getCurrentInstance();
const { sys_normal_disable } = proxy.useDict('sys_normal_disable');

const userList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const multiple = ref(true);
const total = ref(0);
const userIds = ref([]);

const queryParams = reactive({
  page_num: 1,
  page_size: 10,
  role_id: route.params.roleId,
  user_name: undefined,
  phone_num: undefined,
});

/** 查询授权用户列表 */
async function getList() {
  loading.value = true;
  const res = await allocatedUserList(queryParams);
  userList.value = res.list;
  total.value = res.total;
  loading.value = false;
}
// 返回按钮
function handleClose() {
  proxy.$router.back(-1);
  proxy.$tab.closeOpenPage();
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
// 多选框选中数据
function handleSelectionChange(selection) {
  userIds.value = selection.map((item) => item.id);
  multiple.value = !selection.length;
}
/** 打开授权用户表弹窗 */
function openSelectUser() {
  proxy.$refs['selectRef'].show();
}
/** 取消授权按钮操作 */
function cancelAuthUser(row) {
  proxy.$modal
    .confirm('确认要取消该用户"' + row.user_name + '"角色吗？')
    .then(function () {
      return authUserCancel({ user_ids: [row.id], role_id: queryParams.role_id });
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess('取消授权成功');
    })
    .catch(() => {});
}
/** 批量取消授权按钮操作 */
function cancelAuthUserAll(row) {
  const role_id = queryParams.role_id;
  const user_ids = userIds.value;
  proxy.$modal
    .confirm('是否取消选中用户授权数据项?')
    .then(function () {
      return authUserCancel({ user_ids,role_id});
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess('取消授权成功');
    })
    .catch(() => {});
}

getList();
</script>
