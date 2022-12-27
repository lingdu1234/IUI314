<template>
  <div>
    <el-form
      v-show="showSearch"
      ref="queryRef"
      :inline="true"
      :model="queryParams"
      label-width="80px"
      class="base-form"
    >
      <el-form-item label="登录地址" prop="ipaddr">
        <el-input
          v-model="queryParams.ipaddr"
          placeholder="请输入登录地址"
          clearable
          @keyup.enter="getList"
        />
      </el-form-item>
      <el-form-item label="用户名称" prop="user_name">
        <el-input
          v-model="queryParams.user_name"
          placeholder="请输入用户名称"
          clearable
          @keyup.enter="getList"
        />
      </el-form-item>
      <el-form-item label="登录时间">
        <el-date-picker
          v-model="dateRange"
          end-placeholder="结束日期"
          range-separator="-"
          start-placeholder="开始日期"
          type="daterange"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item>
        <el-button :icon="Search" type="primary" @click="getList">
          {{ t('common.search') }}
        </el-button>
        <el-button :icon="Refresh" @click="resetQuery">
          {{ t('common.reset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 操作区域 -->
    <el-row :gutter="10" class="m-b-8px">
      <RightToolBar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <!-- 表格区域 -->
    <el-table :data="list" tooltip-effect="light">
      <el-table-column
        label="序号"
        width="80"
        type="index"
        align="center"
        :index="(index:number) =>1 + index + (queryParams.page_num! - 1) * queryParams.page_size!"
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
            v-if="hasPermission(ApiSysOnlineUser.delete)"
            link
            :icon="Delete"
            @click="handleForceLogout(scope.row)"
          >
            {{ t('common.kickOff') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-show="total > 0"
      v-model:page="queryParams.page_num"
      v-model:limit="queryParams.page_size"
      :total="total"
      @pagination="getList"
    />
  </div>
</template>
<script lang="ts" setup>
import { Delete, Refresh, Search } from '@element-plus/icons-vue'
import {
  type DateModelType,
  type FormInstance,
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElMessageBox,
  ElRow,
  ElTable,
  ElTableColumn,
} from 'element-plus'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { ApiSysOnlineUser } from '@/api/apis'
import Pagination from '@/components/common/pagination.vue'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import {
  hasPermission,
  parseTime,
  useDelete,
  useFormUtil,
  useListData,
} from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { systemMenus } from '@/router'
import type {
  onlineUser,
  onlineUserQueryParam,
} from '@/types/system/online-user'

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const queryRef = ref<FormInstance>()
const showSearch = ref(true)
//  字典数据
const { formReset } = useFormUtil()

const queryParams = ref<onlineUserQueryParam>({
  page_num: 1,
  page_size: 10,
})
const dateRange = ref<[DateModelType, DateModelType]>()

const {
  list,
  getListFn: getList,
  total,
} = useListData<onlineUserQueryParam, onlineUser>(
  ApiSysOnlineUser.getList,
  queryParams,
  dateRange
)

const resetQuery = () => {
  formReset(queryRef.value)
  dateRange.value = undefined
  getList()
}

// 删除数据
const handleForceLogout = async (row: onlineUser) => {
  await ElMessageBox.confirm(`是否确认强退用户 ${row.user_name}?`, '强退用户', {
    type: 'warning',
  })
    .then(async () => {
      const ids = [row.id]
      const { execute } = useDelete(ApiSysOnlineUser.delete, { ids })
      await execute()
      ElMessage.success(`强退用户 ${row.user_name} 成功`)
    })
    .catch(() => {
      ElMessage.info('取消情况操作')
    })
  getList()
}

// 导出名称
defineOptions({
  name: systemMenus.onlineUser.path,
})
</script>
