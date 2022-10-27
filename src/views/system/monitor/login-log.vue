<template>
  <div>
    <el-form
      v-show="showSearch"
      ref="queryRef"
      :inline="true"
      :model="queryParams"
      label-width="68px"
      class="base-form"
    >
      <el-form-item label="登录IP" prop="ip">
        <el-input
          v-model="queryParams.ip"
          clearable
          placeholder="请输入登录IP"
          @keyup.enter="getList"
        />
      </el-form-item>
      <el-form-item label="登录名称" prop="user_name">
        <el-input
          v-model="queryParams.user_name"
          clearable
          placeholder="请输入登录名称"
          @keyup.enter="getList"
        />
      </el-form-item>
      <el-form-item label="字典状态" prop="status">
        <el-select
          v-model="queryParams.status"
          :clearable="true"
          placeholder="字典状态"
        >
          <el-option
            v-for="dict in dicts[dictKey.sysNormalDisable]"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
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
    <el-row :gutter="10" class="m-b-8px" style="height: 35px">
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          :icon="Delete"
          :disabled="!selected"
          @click="handleDelete"
          v-if="hasPermission(ApiSysLoginLog.delete)"
        >
          {{ t('common.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          :icon="Delete"
          @click="handleClean"
          v-if="hasPermission(ApiSysLoginLog.clean)"
        >
          {{ t('common.clean') }}
        </el-button>
      </el-col>

      <RightToolBar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <!-- 表格区域 -->
    <el-table
      :data="list"
      @selection-change="handleSelectionChange"
      tooltip-effect="light"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="访问编号"
        align="center"
        prop="info_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        label="用户名称"
        align="center"
        prop="login_name"
        width="120"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="网络"
        align="center"
        prop="net"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="地址"
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
      <el-table-column label="登录状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag
            :options="dicts[dictKey.sysCommonStatus]"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="描述"
        align="center"
        prop="msg"
        width="100"
        show-overflow-tooltip
      />
      <el-table-column
        label="访问时间"
        align="center"
        prop="login_time"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.login_time) }}</span>
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
<script lang="ts" setup>
import { Delete, Refresh, Search } from '@element-plus/icons-vue'
import { type FormInstance, ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { ApiSysLoginLog } from '@/api/apis'
import DictTag from '@/components/common/dict-tag.vue'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import {
  hasPermission,
  parseTime,
  useDelete,
  useDeleteFn,
  useDicts,
  useFormUtil,
  useListData,
  useTableUtil,
} from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { systemMenus } from '@/router'
import { dictKey } from '@/types/system/dict'
import type { loginLog, loginLogQueryParam } from '@/types/system/login-log'

const queryRef = ref<FormInstance>()
const showSearch = ref(true)
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
//  字典数据
const dicts = useDicts(dictKey.sysCommonStatus)
const { formReset } = useFormUtil()
const { useTableSelectChange } = useTableUtil()
const { handleSelectionChangeFn, ids, values, selected } =
  useTableSelectChange()

const handleSelectionChange = (v: loginLog[]) =>
  handleSelectionChangeFn(v, 'info_id', 'info_id')

const queryParams = ref<loginLogQueryParam>({
  page_num: 1,
  page_size: 10,
})
const dateRange = ref<string[]>([])

const {
  list,
  getListFn: getList,
  total,
} = useListData<loginLogQueryParam, loginLog>(
  ApiSysLoginLog.getList,
  queryParams,
  dateRange
)

const resetQuery = () => {
  formReset(queryRef.value)
  dateRange.value = []
  getList()
}

// 删除数据
const handleDelete = async (row?: loginLog) => {
  const flag = await useDeleteFn(
    ApiSysLoginLog.delete,
    'info_id',
    ids,
    'info_id',
    values,
    'info_ids',
    row
  )
  if (flag) getList()
}

const handleClean = async () => {
  await ElMessageBox.confirm('是否确认清空所有登录日志数据项?', '清空确认', {
    type: 'warning',
  })
    .then(async () => {
      const { execute } = useDelete(ApiSysLoginLog.clean)
      await execute()
      ElMessage.success('清空登录日志成功')
    })
    .catch(() => {
      ElMessage.info('取消情况操作')
    })
  getList()
}

// 导出名称
defineOptions({
  name: systemMenus.loginLog.path,
})
</script>
