<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-18 12:19:37
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\views\system\monitor\pages\scheduled-tasks-log.vue
 * @Description:
-->

<script lang="ts" name="dict-data" setup>
import { Close, Delete, Refresh, Search, View } from '@element-plus/icons-vue'
import { useIntervalFn } from '@vueuse/core'
import {
  type CheckboxValueType,
  type DateModelType,
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
  type FormInstance,
} from 'element-plus'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { ApiSysScheduledTasks, ApiSysScheduledTasksLog } from '@/api/apis'
import DictTag from '@/components/common/dict-tag.vue'
import Pagination from '@/components/common/pagination.vue'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import { TabAction } from '@/components/layout/tab-bar/useTabBar'
import {
  addTimeQueryParam,
  hasPermission,
  parseTime,
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
import { useTabBarStore } from '@/stores'

const dicts = useDicts(
  dictKey.sysTaskIsOnce,
  dictKey.sysCommonStatus,
  dictKey.sysJobGroup,
)
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const route = useRoute()
const { useTableSelectChange } = useTableUtil()
const { formReset } = useFormUtil()
const { handleSelectionChangeFn, ids, values, selected }
  = useTableSelectChange()
function handleSelectionChange(v: dictData[]) {
  return handleSelectionChangeFn(v, 'job_log_id', 'job_log_id')
}
const tabBarStore = useTabBarStore()
const dateRange = ref<[DateModelType, DateModelType]>()
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

async function getList() {
  if (dateRange.value !== undefined)
    queryParams.value = addTimeQueryParam(queryParams.value, dateRange.value!)

  const { data, execute } = useGet<scheduledTasksLogList>(
    ApiSysScheduledTasksLog.getList,
    queryParams,
  )
  await execute()
  list.value = data.value?.list!
  total.value = data.value?.total!
}
// 获取全部任务名称
async function getAllTasks() {
  const _queryParams: scheduledTasksLogQueryParam = {
    page_num: 1,
    page_size: Number.MAX_SAFE_INTEGER,
  }
  const { data, execute } = useGet<scheduledTasksList>(
    ApiSysScheduledTasks.getList,
    _queryParams,
  )
  await execute()
  const _jobMap: Record<string, scheduledTasks> = {}
  data.value?.list!.forEach((it) => {
    _jobMap[it.job_id!] = it
  })
  jobMap.value = _jobMap
  const job_id = route.query.job_id as string
  queryParams.value.job_id = job_id
  job_group.value = jobMap.value[job_id].job_group!
  job_name.value = jobMap.value[job_id].job_name!
}

async function handleDelete(row?: scheduledTasksLog) {
  const flag = await useDeleteFn(
    ApiSysScheduledTasksLog.delete,
    'job_log_id',
    ids,
    'job_log_id',
    values,
    'job_log_ids',
    row,
  )
  if (flag)
    getList()
}
async function handleClean() {
  const job_id = queryParams.value.job_id
  if (job_id === 'all')
    return ElMessage.info('当前选择为ALL,无法清除')
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

function jobIdChanged(v: string) {
  job_group.value = jobMap.value[v].job_group!
  job_name.value = jobMap.value[v].job_name!
  getList()
}

function handleView(row: scheduledTasksLog) {
  form.value = row
  title.value = '任务日志详情'
  open.value = true
}

// 定时任务 定时刷新任务
const { pause, resume } = useIntervalFn(() => getList(), 1500)
const fresh_enabled = ref(false)
// 切换状态
function fresh_option_changed(v: CheckboxValueType) {
  if (v as boolean)
    resume()
  else
    pause()
}

function resetQuery() {
  formReset(queryRef.value)
  getList()
}

function handleClose() {
  // 路由回退
  router.back()
  // 关闭当前标签
  tabBarStore.tabActionSelect(tabBarStore.getCurrentRouteTag(), TabAction.current)
}
onMounted(async () => {
  await getAllTasks()
  await getList()
  if (fresh_enabled.value)
    resume()
  else
    pause()
})
</script>

<template>
  <div>
    <ElForm>
      <ElFormItem label="任务信息" prop="job_group">
        <DictTag :options="dicts[dictKey.sysJobGroup]" :value="job_group" />
        <span> {{ job_name }}</span>
      </ElFormItem>
    </ElForm>
    <el-divider class="m-0" />
    <ElForm
      v-show="showSearch"
      ref="queryRef"
      :inline="true"
      :model="queryParams"
      class="base-form"
      label-width="80px"
    >
      <ElFormItem label="任务ID" prop="job_id">
        <ElSelect
          v-model="queryParams.job_id"
          clearable
          placeholder="请任务组名"
          @change="jobIdChanged"
        >
          <ElOption
            v-for="(v, k) in jobMap"
            :key="k"
            :label="v.task_id"
            :value="k"
          />
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="执行状态" prop="status">
        <ElSelect
          v-model="queryParams.status"
          clearable
          placeholder="请选择执行状态"
        >
          <ElOption
            v-for="dict in dicts[dictKey.sysCommonStatus]"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="任务属性" prop="is_once">
        <ElSelect
          v-model="queryParams.is_once"
          clearable
          placeholder="请选择任务属性"
        >
          <ElOption
            v-for="dict in dicts[dictKey.sysTaskIsOnce]"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="执行时间">
        <ElDatePicker
          v-model="dateRange"
          end-placeholder="结束日期"
          range-separator="-"
          start-placeholder="开始日期"
          type="daterange"
          value-format="YYYY-MM-DD"
        />
      </ElFormItem>
      <ElFormItem>
        <ElButton :icon="Search" type="primary" @click="getList">
          {{ t('common.search') }}
        </ElButton>
        <ElButton :icon="Refresh" @click="resetQuery">
          {{ t('common.reset') }}
        </ElButton>
      </ElFormItem>
    </ElForm>
    <!-- 操作区域 -->
    <ElRow :gutter="10" class="m-b-8px">
      <ElCol :span="1.5">
        <ElButton
          v-if="hasPermission(ApiSysScheduledTasksLog.delete)"
          :disabled="!selected"
          :icon="Delete"
          plain
          type="danger"
          @click="handleDelete()"
        >
          {{ t('common.delete') }}
        </ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton
          v-if="hasPermission(ApiSysScheduledTasksLog.clean)"
          :icon="Delete"
          plain
          type="danger"
          @click="handleClean"
        >
          {{ t('common.clean') }}
        </ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton :icon="Close" plain type="warning" @click="handleClose">
          {{ t('common.close') }}
        </ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <el-checkbox
          v-model="fresh_enabled"
          :label="t('common.auto') + t('common.reFresh')"
          border
          @change="fresh_option_changed"
        />
      </ElCol>
      <RightToolBar v-model:showSearch="showSearch" @query-table="getList" />
    </ElRow>
    <ElTable
      :data="list"
      tooltip-effect="light"
      @selection-change="handleSelectionChange"
    >
      <ElTableColumn align="center" type="selection" width="55" />
      <ElTableColumn
        align="center"
        label="日志编号"
        prop="job_log_id"
        show-overflow-tooltip
        width="80"
      />
      <ElTableColumn
        :show-overflow-tooltip="true"
        align="center"
        label="任务名称"
        prop="job_name"
      />
      <ElTableColumn
        :show-overflow-tooltip="true"
        align="center"
        label="任务组名"
        prop="job_group"
      >
        <template #default="scope">
          <DictTag
            :options="dicts[dictKey.sysJobGroup]"
            :value="scope.row.job_group"
          />
        </template>
      </ElTableColumn>
      <ElTableColumn
        :show-overflow-tooltip="true"
        align="center"
        label="批ID"
        prop="lot_id"
      />
      <ElTableColumn
        :show-overflow-tooltip="true"
        align="center"
        label="批内序"
        prop="lot_order"
      />
      <ElTableColumn
        :show-overflow-tooltip="true"
        align="center"
        label="调用目标字符串"
        prop="invoke_target"
      />
      <ElTableColumn
        :show-overflow-tooltip="true"
        align="center"
        label="日志信息"
        prop="job_message"
      />
      <ElTableColumn align="center" label="执行状态" prop="status">
        <template #default="scope">
          <DictTag
            :options="dicts[dictKey.sysCommonStatus]"
            :value="scope.row.status"
          />
        </template>
      </ElTableColumn>
      <ElTableColumn align="center" label="任务属性" prop="is_once">
        <template #default="scope">
          <DictTag
            :options="dicts[dictKey.sysTaskIsOnce]"
            :value="scope.row.is_once"
          />
        </template>
      </ElTableColumn>
      <ElTableColumn
        align="center"
        label="执行时间"
        prop="created_at"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.created_at) }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn
        align="center"
        class-name="small-padding fixed-width"
        label="操作"
      >
        <template #default="scope">
          <ElButton :icon="View" link @click="handleView(scope.row)">
            {{ t('common.detail') }}
          </ElButton>
        </template>
      </ElTableColumn>
    </ElTable>

    <Pagination
      v-show="total > 0"
      v-model:limit="queryParams.page_size"
      v-model:page="queryParams.page_num"
      :total="total"
      @pagination="getList"
    />
  </div>
</template>
