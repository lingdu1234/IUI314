<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-18 12:19:37
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-11-05 17:04:26
 * @FilePath: \IUI314\src\views\system\monitor\pages\scheduled-tasks-log.vue
 * @Description: 
-->

<template>
  <div>
    <el-form>
      <el-form-item label="任务信息" prop="job_group">
        <DictTag :options="dicts[dictKey.sysJobGroup]" :value="job_group" />
        <span> {{ job_name }}</span>
      </el-form-item>
    </el-form>
    <el-divider class="m-0" />
    <el-form
      v-show="showSearch"
      ref="queryRef"
      :inline="true"
      :model="queryParams"
      label-width="68px"
      class="base-form"
    >
      <el-form-item label="任务ID" prop="job_id">
        <el-select
          v-model="queryParams.job_id"
          placeholder="请任务组名"
          clearable
          @change="jobIdChanged"
        >
          <el-option
            v-for="(v, k) in jobMap"
            :key="k"
            :label="v.task_id"
            :value="k"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="执行状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择执行状态"
          clearable
        >
          <el-option
            v-for="dict in dicts[dictKey.sysCommonStatus]"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务属性" prop="is_once">
        <el-select
          v-model="queryParams.is_once"
          placeholder="请选择任务属性"
          clearable
        >
          <el-option
            v-for="dict in dicts[dictKey.sysTaskIsOnce]"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="执行时间">
        <el-date-picker
          v-model="dateRange"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
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
          v-if="hasPermission(ApiSysScheduledTasksLog.delete)"
          type="danger"
          plain
          :icon="Delete"
          :disabled="!selected"
          @click="handleDelete()"
        >
          {{ t('common.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-if="hasPermission(ApiSysScheduledTasksLog.clean)"
          type="danger"
          plain
          :icon="Delete"
          @click="handleClean"
        >
          {{ t('common.clean') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain :icon="Close" @click="handleClose">
          {{ t('common.close') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-checkbox
          v-model="fresh_enabled"
          border
          :label="t('common.auto') + t('common.reFresh')"
          @change="fresh_option_changed"
        />
      </el-col>
      <RightToolBar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>
    <el-table
      :data="list"
      @selection-change="handleSelectionChange"
      tooltip-effect="light"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="日志编号"
        width="80"
        align="center"
        prop="job_log_id"
        show-overflow-tooltip
      />
      <el-table-column
        label="任务名称"
        align="center"
        prop="job_name"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="任务组名"
        align="center"
        prop="job_group"
        :show-overflow-tooltip="true"
      >
        <template #default="scope">
          <DictTag
            :options="dicts[dictKey.sysJobGroup]"
            :value="scope.row.job_group"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="批ID"
        align="center"
        prop="lot_id"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="批内序"
        align="center"
        prop="lot_order"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="调用目标字符串"
        align="center"
        prop="invoke_target"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="日志信息"
        align="center"
        prop="job_message"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="执行状态" align="center" prop="status">
        <template #default="scope">
          <DictTag
            :options="dicts[dictKey.sysCommonStatus]"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column label="任务属性" align="center" prop="is_once">
        <template #default="scope">
          <DictTag
            :options="dicts[dictKey.sysTaskIsOnce]"
            :value="scope.row.is_once"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="执行时间"
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
          <el-button link :icon="View" @click="handleView(scope.row)">
            {{ t('common.detail') }}
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
<script lang="ts" setup name="dict-data">
import { Close, Delete, Refresh, Search, View } from '@element-plus/icons-vue'
import { useIntervalFn } from '@vueuse/core'
import {
  type FormInstance,
  ElButton,
  ElCol,
  ElDatePicker,
  ElForm,
  ElFormItem,
  ElMessage,
  ElMessageBox,
  ElOption,
  ElRow,
  ElSelect,
  ElTable,
  ElTableColumn,
} from 'element-plus'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { ApiSysScheduledTasks, ApiSysScheduledTasksLog } from '@/api/apis'
import DictTag from '@/components/common/dict-tag.vue'
import Pagination from '@/components/common/pagination.vue'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import { Eaction } from '@/components/layout/tab-bar/useTabBar'
import {
  hasPermission,
  parseTime,
  setTabBarEmitter,
  useDelete,
  useDeleteFn,
  useDicts,
  useFormUtil,
  useGet,
  useTableUtil,
} from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { router } from '@/router'
import { type dictData, dictKey } from '@/types/system/dict'
import type {
  scheduledTasks,
  scheduledTasksList,
  scheduledTasksLog,
  scheduledTasksLogList,
  scheduledTasksLogQueryParam,
} from '@/types/system/scheduled-tasks'
const dicts = useDicts(
  dictKey.sysTaskIsOnce,
  dictKey.sysCommonStatus,
  dictKey.sysJobGroup
)
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const route = useRoute()
const { useTableSelectChange } = useTableUtil()
const { formReset } = useFormUtil()
const { handleSelectionChangeFn, ids, values, selected } =
  useTableSelectChange()
const handleSelectionChange = (v: dictData[]) =>
  handleSelectionChangeFn(v, 'job_log_id', 'job_log_id')

const dateRange = ref<string[]>([])
const jobMap = ref<Record<string, scheduledTasks>>({})

const showSearch = ref(true)
const queryRef = ref<FormInstance | undefined>()
const open = ref(false)
const title = ref('')

const queryParams = ref<scheduledTasksLogQueryParam>({
  page_num: 1,
  page_size: 10,
})
const job_group = ref('')
const job_name = ref('')
const total = ref(0)
const list = ref<scheduledTasksLog[]>([])

const form = ref<scheduledTasksLog>({})

const getList = async () => {
  const { data, execute } = useGet<scheduledTasksLogList>(
    ApiSysScheduledTasksLog.getList,
    queryParams
  )
  await execute()
  list.value = data.value?.list!
  total.value = data.value?.total!
}
// 获取全部任务名称
const getAllTasks = async () => {
  const _queryParams: scheduledTasksLogQueryParam = {
    page_num: 1,
    page_size: Number.MAX_SAFE_INTEGER,
  }
  const { data, execute } = useGet<scheduledTasksList>(
    ApiSysScheduledTasks.getList,
    _queryParams
  )
  await execute()
  let _jobMap: Record<string, scheduledTasks> = {}
  data.value?.list!.forEach((it) => {
    _jobMap[it.job_id!] = it
  })
  jobMap.value = _jobMap
  const job_id = route.query.job_id as string
  queryParams.value.job_id = job_id
  job_group.value = jobMap.value[job_id].job_group!
  job_name.value = jobMap.value[job_id].job_name!
}

const handleDelete = async (row?: scheduledTasksLog) => {
  const flag = await useDeleteFn(
    ApiSysScheduledTasksLog.delete,
    'job_log_id',
    ids,
    'job_log_id',
    values,
    'job_log_ids',
    row
  )
  if (flag) getList()
}
const handleClean = async () => {
  const job_id = queryParams.value.job_id
  if (job_id === 'all') return ElMessage.info('当前选择为ALL,无法清除')
  await ElMessageBox.confirm('是否确认清空当前的任务日志?', '清空确认', {
    type: 'warning',
  })
    .then(async () => {
      const { execute } = useDelete(ApiSysScheduledTasksLog.clean, { job_id })
      await execute()
      ElMessage.success('清空登录日志成功')
    })
    .catch(() => {
      ElMessage.info('取消情况操作')
    })
  getList()
}

const jobIdChanged = (v: string) => {
  job_group.value = jobMap.value[v].job_group!
  job_name.value = jobMap.value[v].job_name!
  getList()
}

const handleView = (row: scheduledTasksLog) => {
  form.value = row
  title.value = '任务日志详情'
  open.value = true
}

// 定时任务 定时刷新任务
const { pause, resume } = useIntervalFn(() => getList(), 1500)
const fresh_enabled = ref(false)
// 切换状态
const fresh_option_changed = (v: boolean) => {
  if (v) {
    resume()
  } else {
    pause()
  }
}

const resetQuery = () => {
  formReset(queryRef.value)
  getList()
}

const handleClose = () => {
  // 路由回退
  router.back()
  // 关闭当前便签
  setTabBarEmitter(Eaction.current)
}
onMounted(async () => {
  await getAllTasks()
  await getList()
  if (fresh_enabled.value) {
    resume()
  } else {
    pause()
  }
})
</script>
