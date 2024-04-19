<script setup lang="ts">
import { type PropType, computed, h, ref } from 'vue'
import { IconEdit, IconPlus } from '@arco-design/web-vue/es/icon'
import { Message } from '@arco-design/web-vue'
import { useI18n } from 'vue-i18n'
import IuModal from '@/components/iui/iu-modal.vue'
import { FormItemType, type IuFormField } from '@/types/base/iu-form'
import { dictKey, type dictUse } from '@/types/system/dict'
import { useGet, usePost, usePut } from '@/hooks'
import { ApiSysScheduledTasks } from '@/api/sysApis'
import { ErrorFlag } from '@/api/apis'
import type { MessageSchema } from '@/i18n'
import type { scheduledTasks } from '@/types/system/scheduled-tasks'
import VCron from '@/components/v-cron/index.vue'

defineOptions({ name: 'ScheduledTasksModal' })

const props = defineProps({
  ids: {
    type: Array as PropType<string[]>,
    required: true,
  },
  dicts: {
    type: Object as PropType<Record<string, dictUse[]>>,
    required: true,
  },
})

const emits = defineEmits(['getList'])

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })

const iuModalRef = ref<InstanceType<typeof IuModal>>()

const modalIcon = ref()
const open = ref(false)
const openCron = ref(false)
const title = ref('')
const form = ref<scheduledTasks>({})

const modalFormItems = ref<IuFormField[]>([
  {
    field: 'job_name',
    label: '任务名称',
    type: FormItemType.input,
    placeholder: '请输入任务名称',
    rule: [
      { required: true, message: '任务名称不能为空' },
      { type: 'string', minLength: 2, maxLength: 20, message: '任务名称2~20个字符' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'invoke_target',
    label: '调用方法',
    type: FormItemType.input,
    tooltip: '调用方法:如test_a,就是唯一的定义好的方法代号',
    placeholder: '请输入调用方法',
    rule: [
      { required: true, message: '调用方法不能为空' },
      { type: 'string', minLength: 2, maxLength: 20, message: '调用方法2~20个字符' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'task_count',
    label: '运行次数',
    type: FormItemType.inputNumber,
    tooltip: '运行次数:0表示无限次',
    inputNumberMode: 'button',
    inputNumberOptions: {
      min: 0,
      max: 999999,
      step: 1,
      precision: 0,
      defaultValue: 0,
    },
    placeholder: '请输入显示排序',
    rule: [
      { required: true, message: '显示排序不能为空' },
    ],
  },
  {
    field: 'job_params',
    label: '调用参数',
    type: FormItemType.input,
    placeholder: '请输入调用参数',
    tooltip: '调用参数,均为字符串;基础类型：字符串，布尔类型，长整型，浮点型，整型;复杂类型: json字符串 {"a":11,"b":"你好"}',
  },
  {
    field: 'task_id',
    label: '任务ID',
    type: FormItemType.inputNumber,
    tooltip: '任务ID,非常重要，请谨慎修改，为任务运行时的唯一标识',
    inputNumberMode: 'button',
    disabled: computed(() => form.value.status === '1'),
    inputNumberOptions: {
      min: 100,
      max: 999999,
      step: 1,
      precision: 0,
      defaultValue: 1000,
    },
    placeholder: '请输入显示排序',
    rule: [
      { required: true, message: '显示排序不能为空' },
    ],
  },
  {
    field: 'status',
    label: '任务状态',
    type: FormItemType.radio,
    selectOption: {
      dataOption: computed(() => props.dicts[dictKey.sysNormalDisable]),
      dataOptionKey: {
        label: 'label',
        value: 'value',
      },
    },
    rule: [
      { required: true, message: '任务状态必须选择' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'cron_expression',
    label: 'cron表达式',
    type: FormItemType.slot,
    slotName: 'cronExpression',
    tooltip: 'cron表达式',
    defaultCol: 2,
    defaultIsOnlyOne: true,
    fullScreenCol: 2,
    fullScreenIsOnlyOne: true,
  },
  {
    field: 'misfire_policy',
    label: '执行策略',
    type: FormItemType.radio,
    inputNumberMode: 'button',
    tooltip: '请选择执行策略',
    selectOption: {
      dataOption: [
        {
          label: '立即执行',
          value: '1',
        },
        {
          label: '执行一次',
          value: '2',
        },
        {
          label: '暂不执行',
          value: '3',
        },
      ],
      dataOptionKey: {
        label: 'label',
        value: 'value',
      },
    },
    rule: [
      { required: true, message: '岗位状态必须选择' },
    ],
    validateTrigger: 'blur',
    defaultCol: 2,
    defaultIsOnlyOne: true,
    fullScreenCol: 2,
    fullScreenIsOnlyOne: true,
  },
])
function handleAdd() {
  modalIcon.value = h(IconPlus)
  open.value = true
  form.value = {
    task_count: 0,
    task_id: 0,
    status: '0',
    misfire_policy: '1',
  }
  title.value = '添加任务'
}
async function handleUpdate(row?: scheduledTasks) {
  modalIcon.value = h(IconEdit)
  if (row) {
    form.value = { ...row }
  }
  else {
    const job_id = props.ids[0]
    const { data, execute } = useGet<scheduledTasks>(ApiSysScheduledTasks.getById, { job_id })
    await execute()
    form.value = data.value as scheduledTasks
  }
  title.value = `更新任务-${form.value.job_name}`
  open.value = true
}
async function submitForm() {
  if (form.value.job_id !== undefined) {
    const { execute, data } = usePut(ApiSysScheduledTasks.edit, form)

    await execute()
    if (data.value === ErrorFlag)
      return
    Message.success(t('commonTip.updateSuccess'))
  }
  else {
    const { execute, data } = usePost(ApiSysScheduledTasks.add, form)
    await execute()
    if (data.value === ErrorFlag)
      return
    Message.success(t('commonTip.addSuccess'))
  }
  open.value = false
  emits('getList')
}

defineExpose({ handleAdd, handleUpdate })
</script>

<template>
  <IuModal
    ref="iuModalRef"
    v-model:visible="open"
    v-model:form-value="form"
    :form-items="modalFormItems"
    :icon="modalIcon"
    :title="title"
    :item-width="250"
    :default-col="2"
    :full-screen-col="2"
    @handle-ok="submitForm"
  >
    <template #cronExpression>
      <a-input v-model="form.cron_expression" allow-clear>
        <template #append>
          <div class="cursor-pointer" @click="() => openCron = true">
            <span>生成表达式</span><IconClockCircle class="m-l-5px" />
          </div>
        </template>
      </a-input>
    </template>
  </IuModal>
  <VCron
    v-if="openCron"
    v-model:cron-value="form.cron_expression"
    v-model:visible="openCron"
  />
</template>
