<template>
  <el-dialog
    v-model="openDetail"
    :before-close="cancel"
    :title="title"
    append-to-body
    width="680px"
  >
    <el-form :model="form" label-width="120px" class="base-form">
      <el-row :gutter="2">
        <el-col :span="12">
          <el-form-item label="任务ID:">
            {{ form.task_id }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务分组:">
            <dict-tag
              :options="dicts[dictKey.sysJobGroup]"
              :value="form.job_group"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务名称:">
            {{ form.job_name }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建时间:">
            {{ form.created_at }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="cron表达式:">
            {{ form.cron_expression }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="执行次数:">
            {{ form.task_count }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上次执行时间:">
            {{ parseTime(form.last_time) }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="调用目标方法:">
            {{ form.invoke_target }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下次执行时间:">
            {{ parseTime(form.next_time) }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="调用目标参数:">
            {{ form.job_params }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务状态:">
            <div v-if="form.status === '1'">正常</div>
            <div v-else-if="form.status === '0'">暂停</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否并发:">
            <div v-if="form.concurrent === '1'">允许</div>
            <div v-else-if="form.concurrent === '0'">禁止</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="执行策略:">
            <div v-if="form.misfire_policy === '0'">默认策略</div>
            <div v-else-if="form.misfire_policy === '1'">立即执行</div>
            <div v-else-if="form.misfire_policy === '2'">执行一次</div>
            <div v-else-if="form.misfire_policy === '3'">放弃执行</div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注:">
            <pre>{{ form.remark }}</pre>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel"> 关 闭 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

import { ApiSysScheduledTasks } from '@/api/sysApis'
import { parseTime, useDicts, useGet } from '@/hooks'
import { dictKey } from '@/types/system/dict'
import type { scheduledTasks } from '@/types/system/scheduled-tasks'

const props = defineProps({
  jobId: {
    type: String,
    required: true,
  },
  openDetail: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
})
const emits = defineEmits(['closeDialog'])
const form = ref<scheduledTasks>({})

const getTaskDetail = async () => {
  const { data, execute } = useGet(ApiSysScheduledTasks.getById, {
    job_id: props.jobId,
  })
  await execute()
  form.value = data.value!
}

// 字典数据
const dicts = useDicts(dictKey.sysJobGroup)

const cancel = () => {
  emits('closeDialog')
}
getTaskDetail()
</script>
