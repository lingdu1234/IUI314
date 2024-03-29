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
      <el-form-item label="任务名称" prop="job_name">
        <el-input
          v-model="queryParams.job_name"
          clearable
          placeholder="请输入任务名称"
          @keyup.enter="getList"
        />
      </el-form-item>
      <el-form-item label="任务组名" prop="job_group">
        <el-select
          v-model="queryParams.job_group"
          clearable
          placeholder="请选择任务组名"
        >
          <el-option
            v-for="dict in dicts[dictKey.sysJobGroup]"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务状态" prop="status">
        <el-select
          v-model="queryParams.status"
          clearable
          placeholder="请选择任务状态"
        >
          <el-option
            v-for="dict in dicts[dictKey.sysJobStatus]"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
          v-if="hasPermission(ApiSysScheduledTasks.add)"
          :icon="Plus"
          plain
          type="primary"
          @click="handleAdd"
        >
          {{ t('common.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-if="hasPermission(ApiSysScheduledTasks.edit)"
          :disabled="!single"
          :icon="Edit"
          plain
          type="success"
          @click="handleUpdate()"
        >
          {{ t('common.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-if="hasPermission(ApiSysScheduledTasks.delete)"
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
          v-if="hasPermission(ApiSysScheduledTasksLog.getList)"
          :icon="Operation"
          plain
          type="info"
          @click="handleJobLog()"
        >
          {{ t('common.log') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-checkbox
          v-model="fresh_enabled"
          :label="t('common.auto') + t('common.reFresh')"
          border
          @change="fresh_option_changed"
        />
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
        label="任务ID"
        show-overflow-tooltip
        width="100"
      >
        <template #default="scope">
          <el-tag type="warning" @click="handleJobLog(scope.row)">
            <el-link type="warning">
              {{ scope.row.task_id }}
            </el-link>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="任务名称"
        prop="job_name"
      >
        <template #default="scope">
          <el-link type="success" @click="handleView(scope.row)">
            {{ scope.row.job_name }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="任务组名" prop="job_group">
        <template #default="scope">
          <DictTag
            :options="dicts[dictKey.sysJobGroup]"
            :value="scope.row.job_group"
          />
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="调用目标字符串"
        prop="invoke_target"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="cron执行表达式"
        prop="cron_expression"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="下次执行时间"
      >
        <template #default="scope">
          <span v-if="scope.row.status == '0'">任务未运行</span>
          <span v-else>{{ parseTime(scope.row.next_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="批次数"
        width="100"
      >
        <template #default="scope">
          <span v-if="scope.row.task_count == '0'">无限</span>
          <span v-else>{{ scope.row.task_count }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="已执行"
        prop="run_count"
        width="100"
      />
      <el-table-column align="center" label="状态">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="1"
            inactive-value="0"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template #default="scope">
          <el-tooltip
            v-if="hasPermission(ApiSysScheduledTasks.edit)"
            content="修改"
            effect="light"
            placement="top"
          >
            <el-button :icon="Edit" link @click="handleUpdate(scope.row)" />
          </el-tooltip>
          <el-tooltip
            v-if="hasPermission(ApiSysScheduledTasks.delete)"
            content="删除"
            effect="light"
            placement="top"
          >
            <el-button :icon="Delete" link @click="handleDelete(scope.row)" />
          </el-tooltip>
          <el-tooltip
            v-if="hasPermission(ApiSysScheduledTasks.runOnce)"
            content="执行一次"
            effect="light"
            placement="top"
          >
            <el-button :icon="CaretRight" link @click="handleRun(scope.row)" />
          </el-tooltip>
          <el-tooltip
            v-if="hasPermission(ApiSysScheduledTasks.getById)"
            content="任务详细"
            effect="light"
            placement="top"
          >
            <el-button :icon="View" link @click="handleView(scope.row)" />
          </el-tooltip>
          <el-tooltip
            v-if="hasPermission(ApiSysScheduledTasksLog.getList)"
            content="调度日志"
            effect="light"
            placement="top"
          >
            <el-button
              :icon="Operation"
              link
              @click="handleJobLog(scope.row)"
            />
          </el-tooltip>
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
    <!-- 任务详情对话框 -->
    <ScheduledTasksDetail
      v-if="openDetail"
      :job-id="jobId"
      :open-detail="openDetail"
      :title="title"
      @close-dialog="closeDialog"
    />
    <!-- 新增编辑对话框 -->
    <ScheduledTasksDialog
      v-if="open"
      :form-data="form"
      :open="open"
      :title="title"
      @close-dialog="closeDialog"
    />
  </div>
</template>
<script lang="ts" setup>
import {
  CaretRight,
  Delete,
  Edit,
  Operation,
  Plus,
  Refresh,
  Search,
  View,
} from '@element-plus/icons-vue'
import { useIntervalFn } from '@vueuse/core'
import {
  type DateModelType,
  ElButton,
  ElCheckbox,
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  ElLink,
  ElMessage,
  ElMessageBox,
  ElOption,
  ElRow,
  ElSelect,
  ElSwitch,
  ElTable,
  ElTableColumn,
  ElTag,
  ElTooltip,
  type FormInstance,
} from 'element-plus'
import { onActivated, onDeactivated, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  ApiSysScheduledTasks,
  ApiSysScheduledTasksLog,
  ErrorFlag,
} from '@/api/apis'
import DictTag from '@/components/common/dict-tag.vue'
import Pagination from '@/components/common/pagination.vue'
import RightToolBar from '@/components/common/right-tool-bar.vue'
import {
  hasPermission,
  parseTime,
  useDeleteFn,
  useDicts,
  useFormUtil,
  useGet,
  useListData,
  usePut,
  useTableUtil,
} from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { router, ScheduledTasksLogRouteName, systemMenus } from '@/router'
import { dictKey } from '@/types/system/dict'
import type {
  scheduledTasks,
  scheduledTasksQueryParam,
} from '@/types/system/scheduled-tasks'

import ScheduledTasksDetail from './pages/scheduled-tasks-detail.vue'
import ScheduledTasksDialog from './pages/scheduled-tasks-dialog.vue'

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const queryRef = ref<FormInstance>()
const showSearch = ref(true)

const form = ref<scheduledTasks>({})
const open = ref(false)
//  字典数据
const dicts = useDicts(dictKey.sysJobGroup, dictKey.sysJobStatus)

const { formReset } = useFormUtil()

const { useTableSelectChange } = useTableUtil()
const { handleSelectionChangeFn, ids, values, single, selected } =
  useTableSelectChange()
const handleSelectionChange = (v: scheduledTasks[]) =>
  handleSelectionChangeFn(v, 'job_id', 'job_name')

// 定时任务 定时刷新任务
const { pause, resume } = useIntervalFn(() => getList(), 1500)
const fresh_enabled = ref(false)
// 切换状态
const fresh_option_changed = (v: string | number | boolean) => {
  if (v) {
    resume()
  } else {
    pause()
  }
}

const queryParams = ref<scheduledTasksQueryParam>({
  page_num: 1,
  page_size: 10,
})
const dateRange = ref<[DateModelType, DateModelType]>()

const title = ref('')
// 任务详情
const openDetail = ref(false)
const jobId = ref('')

const {
  list,
  getListFn: getList,
  total,
} = useListData<scheduledTasksQueryParam, scheduledTasks>(
  ApiSysScheduledTasks.getList,
  queryParams,
  dateRange,
)

const resetQuery = () => {
  formReset(queryRef.value)
  dateRange.value = undefined
  getList()
}

const handleAdd = () => {
  form.value = {
    task_count: 0,
    task_id: 0,
    status: '0',
    misfire_policy: '1',
  }
  open.value = true
  title.value = '新增任务'
}
const handleUpdate = async (row?: scheduledTasks) => {
  if (row?.job_id) {
    form.value = row
  } else {
    const job_id = ids.value[0]
    const { data, execute } = useGet(ApiSysScheduledTasks.getById, { job_id })
    await execute()
    form.value = data.value!
  }

  open.value = true
  title.value = '更新任务'
}

// 删除数据
const handleDelete = async (row?: scheduledTasks) => {
  const flag = await useDeleteFn(
    ApiSysScheduledTasks.delete,
    'job_id',
    ids,
    'job_name',
    values,
    'job_ids',
    row,
  )
  if (flag) getList()
}

const handleStatusChange = async (row: scheduledTasks) => {
  const text = row.status === '1' ? '启用' : '停用'
  await ElMessageBox.confirm(
    `确定要  ${text}  ${row.job_name}  吗?`,
    '任务状态',
    { type: 'warning' },
  )
    .then(async () => {
      const { data, execute } = usePut(ApiSysScheduledTasks.changeStatus, {
        job_id: row.job_id,
        status: row.status,
      })
      await execute()
      if (data.value === ErrorFlag) return
      ElMessage.success(`你成功 ${text} 任务 ${row.job_name}`)
      getList()
    })
    .catch(() => {
      ElMessage.info('你取消了操作')
      row.status = row.status === '0' ? '1' : '0'
    })
}
const handleRun = async (row: scheduledTasks) => {
  await ElMessageBox.confirm(
    `确定立即执行一次  ${row.job_name}  吗?`,
    '任务运行',
    { type: 'info' },
  )
    .then(async () => {
      const { data, execute } = usePut(ApiSysScheduledTasks.runOnce, {
        job_id: row.job_id,
        task_id: row.task_id,
      })
      await execute()
      if (data.value === ErrorFlag) return
      ElMessage.success(`你成功运行任务 ${row.job_name}`)
    })
    .catch(() => {
      ElMessage.info('你取消了操作')
    })
}

const handleView = (row: scheduledTasks) => {
  jobId.value = row.job_id!
  openDetail.value = true
  title.value = '任务详情'
}

const handleJobLog = (row?: scheduledTasks) => {
  const job_id = row?.job_id || 'all'
  router.push({
    name: ScheduledTasksLogRouteName,
    query: { job_id },
  })
}

const closeDialog = () => {
  openDetail.value = false
  open.value = false
  getList()
}

onDeactivated(() => {
  pause()
})
onActivated(() => {
  if (fresh_enabled.value) {
    resume()
  } else {
    pause()
  }
})

// 导出名称
defineOptions({
  name: systemMenus.scheduledTasks.path,
})
</script>
