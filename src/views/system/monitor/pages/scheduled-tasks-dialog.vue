<template>
  <el-dialog
    v-model="open"
    :title="title"
    width="680px"
    :before-close="cancel"
    append-to-body
  >
    <el-form
      ref="taskFormRef"
      label-width="100px"
      :rules="rules"
      :model="form"
      class="base-form"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="任务名称" prop="job_name">
            <el-input v-model="form.job_name" placeholder="请输入任务名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务分组" prop="job_group">
            <el-select v-model="form.job_group" placeholder="请选择">
              <el-option
                v-for="dict in dicts[dictKey.sysJobGroup]"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="invoke_target">
            <template #label>
              <span>
                <el-tooltip placement="top" effect="light">
                  <template #content>
                    <div>调用方法:如test_a,就是唯一的定义好的方法代号</div>
                  </template>
                  <el-icon><info-filled /></el-icon>
                </el-tooltip>
                调用方法
              </span>
            </template>
            <el-input
              v-model="form.invoke_target"
              placeholder="请输入调用目标字符串"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item prop="task_count">
            <template #label>
              <span>
                <el-tooltip placement="top" effect="light">
                  <template #content>
                    <div>
                      运行次数：
                      <br />0 -> 无限循环运行 <br />n -> 循环运行n次
                    </div>
                  </template>
                  <el-icon><info-filled /></el-icon>
                </el-tooltip>
                运行次数
              </span>
            </template>
            <el-input-number
              v-model="form.task_count"
              controls-position="right"
              :min="0"
              :max="max_task_count"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="job_params">
            <template #label>
              <span>
                <el-tooltip placement="top" effect="light">
                  <template #content>
                    <div>
                      调用参数,均为字符串，
                      <br />基础类型：字符串，布尔类型，长整型，浮点型，整型
                      <br />复查类型: json字符串 {"a":11,"b":"你好"}
                    </div>
                  </template>
                  <el-icon><info-filled /></el-icon>
                </el-tooltip>
                调用参数
              </span>
            </template>
            <el-input v-model="form.job_params" placeholder="请输入调用参数" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="task_id">
            <template #label>
              <span>
                <el-tooltip placement="top" effect="light">
                  <template #content>
                    <div>
                      任务ID,非常重要，请谨慎修改
                      <br />整数类型 <br />为任务运行时的唯一标识
                    </div>
                  </template>
                  <el-icon><info-filled /></el-icon>
                </el-tooltip>
                任务ID
              </span>
            </template>
            <el-input-number
              v-model="form.task_id"
              controls-position="right"
              :min="0"
              :max="max_task_id"
              :disabled="form.status == '1'"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="cron表达式" prop="cron_expression">
            <el-input
              v-model="form.cron_expression"
              placeholder="请输入cron执行表达式"
            >
              <template #append>
                <el-button type="primary" @click="handleShowCron">
                  生成表达式
                  <el-icon class="el-icon--right"><Timer /></el-icon>
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="执行策略" prop="misfire_policy">
            <el-radio-group v-model="form.misfire_policy">
              <el-radio-button label="1"> 立即执行 </el-radio-button>
              <el-radio-button label="2"> 执行一次 </el-radio-button>
              <el-radio-button label="3"> 放弃执行 </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态">
            <el-radio-group v-model="form.status">
              <el-radio-button
                v-for="dict in dicts[dictKey.sysNormalDisable]"
                :key="dict.value"
                :label="dict.value"
              >
                {{ dict.label }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">
          {{ t('common.submit') }}
        </el-button>
        <el-button @click="cancel">
          {{ t('common.cancel') }}
        </el-button>
      </div>
    </template>
    <!-- cron 表达式对话框 -->
    <VueCron
      v-if="openCron"
      :open="openCron"
      @close-dialog="closeCron"
      @set-cron-exp="setCronExp"
    />
  </el-dialog>
</template>
<script lang="ts" setup name="menu-dialog">
import { InfoFilled, Timer } from '@element-plus/icons-vue'
import { type FormInstance, type FormRules, ElMessage } from 'element-plus'
import { type PropType, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { ApiSysScheduledTasks, ErrorFlag } from '@/api/apis'
import VueCron from '@/components/vue-cron/vue-cron.vue'
import { useDicts, useFormUtil, usePost, usePut } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { dictKey } from '@/types/system/dict'
import type { scheduledTasks } from '@/types/system/scheduled-tasks'

const props = defineProps({
  formData: {
    type: Object as PropType<scheduledTasks>,
    required: true,
  },
  open: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
})

const openCron = ref(false)
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const emits = defineEmits(['closeDialog'])
const { formValidate } = useFormUtil()

const taskFormRef = ref<FormInstance>()

const form = ref<scheduledTasks>({ ...props.formData })
const max_task_id = ref(99999)
const max_task_count = ref(9999)

const rules = ref<FormRules>({
  job_name: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }],
  invoke_target: [
    { required: true, message: '调用目标字符串不能为空', trigger: 'blur' },
  ],
  cron_expression: [
    { required: true, message: 'cron执行表达式不能为空', trigger: 'blur' },
  ],
})

// 字典数据
const dicts = useDicts(dictKey.sysNormalDisable, dictKey.sysJobGroup)

//  提交按钮函数
const submitForm = async () => {
  if (!(await formValidate(taskFormRef.value))) return
  if (form.value.job_id !== undefined) {
    const { data, execute } = usePut(ApiSysScheduledTasks.edit, form)
    await execute()
    if (data.value === ErrorFlag) return
    ElMessage.success(t('commonTip.updateSuccess'))
  } else {
    const { data, execute } = usePost(ApiSysScheduledTasks.add, form)
    await execute()
    if (data.value === ErrorFlag) return
    ElMessage.success(t('commonTip.addSuccess'))
  }
  cancel()
}
const handleShowCron = () => {
  openCron.value = true
}

const closeCron = () => {
  openCron.value = false
}
const setCronExp = (v: string) => {
  form.value.cron_expression = v
}

const cancel = () => {
  emits('closeDialog')
}
</script>
