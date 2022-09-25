<template>
  <div class="app-container">
    <el-form
      ref="queryRef"
      :model="queryParams"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="登录地址" prop="ipaddr">
        <el-input
          v-model="queryParams.ipaddr"
          placeholder="请输入登录地址"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户名称" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名称"
          clearable
          @keyup.enter="handleQuery"
        />
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
    <el-table v-loading="loading" :data="onlineList" style="width: 100%">
      <el-table-column
        label="序号"
        width="50"
        type="index"
        align="center"
        :index="
          (index) =>
            1 + index + (queryParams.page_num - 1) * queryParams.page_size
        "
      />
      <el-table-column
        label="会话编号"
        align="center"
        prop="id"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="登录名称"
        align="center"
        prop="user_name"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="所属部门"
        align="center"
        prop="dept_name"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="网络"
        align="center"
        prop="net"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="主机"
        align="center"
        prop="ipaddr"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="登录地点"
        align="center"
        prop="login_location"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="操作系统"
        align="center"
        prop="os"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="浏览器"
        align="center"
        prop="browser"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="设备"
        align="center"
        prop="device"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="登录时间"
        align="center"
        prop="login_time"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.login_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            v-hasPermi="['system/online/delete']"
            link
            icon="Delete"
            @click="handleForceLogout(scope.row)"
          >
            强退
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      v-model:page="queryParams.page_num"
      v-model:limit="queryParams.page_size"
      :total="total"
      @pagination="getList"
    />
  </div>
</template>

<script setup name="Online">
import { getCurrentInstance,ref } from "vue";

import { forceLogout, list as initData } from "@/api/monitor/online";

const { proxy } = getCurrentInstance();

const onlineList = ref([]);
const loading = ref(true);
const total = ref(0);

const queryParams = ref({
  ipaddr: undefined,
  user_name: undefined,
  page_num: 1,
  page_size: 10,
});

/** 查询登录日志列表 */
function getList() {
  loading.value = true;
  initData(queryParams.value).then((response) => {
    onlineList.value = response.list;
    total.value = response.total;
    loading.value = false;
  });
}
/** 搜索按钮操作 */
function handleQuery() {
  page_num.value = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}
/** 强退按钮操作 */
function handleForceLogout(row) {
  let ids = [row.id];
  proxy.$modal
    .confirm("是否确认强退名称为\"" + row.user_name + "\"的用户?")
    .then(function () {
      return forceLogout({ ids });
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("强退成功");
    })
    .catch(() => {});
}

getList();
</script>
