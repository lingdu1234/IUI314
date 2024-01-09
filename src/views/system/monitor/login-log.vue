<template>
  <div>
    <el-form
      v-show="showSearch"
      ref="queryRef"
      :inline="true"
      :model="queryParams"
      class="base-form"
      label-width="80px"
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
    <el-row :gutter="10" class="m-b-8px">
      <el-col :span="1.5">
        <el-button
          v-if="hasPermission(ApiSysLoginLog.delete)"
          :disabled="!selected"
          :icon="Delete"
          plain
          type="danger"
          @click="handleDelete()"
        >
          {{ t('common.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-if="hasPermission(ApiSysLoginLog.clean)"
          :icon="Delete"
          plain
          type="danger"
          @click="handleClean"
        >
          {{ t('common.clean') }}
        </el-button>
      </el-col>

      <RightToolBar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <!-- 表格区域 -->
    <el-table
      :data="list"
      tooltip-effect="light"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column
        align="center"
        label="访问编号"
        prop="info_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="用户名称"
        prop="login_name"
        width="120"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="网络"
        prop="net"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="地址"
        prop="ipaddr"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="登录地点"
        prop="login_location"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="操作系统"
        prop="os"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="浏览器"
        prop="browser"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="设备"
        prop="device"
      />
      <el-table-column align="center" label="登录状态" prop="status">
        <template #default="scope">
          <DictTag
            :options="dicts[dictKey.sysCommonStatus]"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="描述"
        prop="msg"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        label="访问时间"
        prop="login_time"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.login_time) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-show="total > 0"
      v-model:limit="queryParams.page_size"
      v-model:page="queryParams.page_num"
      :total="total"
      @pagination="getList"
    />
  </div>
</template>
<script lang="ts" setup>
import { Delete, Refresh, Search } from '@element-plus/icons-vue'
import {
  type DateModelType,
  ElButton,
  ElCol,
  ElDatePicker,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElMessageBox,
  ElOption,
  ElRow,
  ElSelect,
  ElTable,
  ElTableColumn,
  type FormInstance,
} from 'element-plus'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { ApiSysLoginLog } from '@/api/apis'
import DictTag from '@/components/common/dict-tag.vue'
import Pagination from '@/components/common/pagination.vue'
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
const dateRange = ref<[DateModelType, DateModelType]>()

const {
  list,
  getListFn: getList,
  total,
} = useListData<loginLogQueryParam, loginLog>(
  ApiSysLoginLog.getList,
  queryParams,
  dateRange,
)

const resetQuery = () => {
  formReset(queryRef.value)
  dateRange.value = undefined
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
    row,
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
