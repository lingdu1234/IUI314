<script setup lang="ts">
import { type PropType, h, ref } from 'vue'
import { IconPlus } from '@arco-design/web-vue/es/icon'
import IuModal from '@/components/iui/iu-modal.vue'
import { FormItemType, type IuFormField } from '@/types/base/iu-form'
import { dictKey, type dictUse } from '@/types/system/dict'
import type { scheduledTasks } from '@/types/system/scheduled-tasks'
import DictTag from '@/components/common/dict-tag.vue'
import { parseTime } from '@/hooks'

defineOptions({ name: 'ScheduledTasksDetail' })

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

const iuModalRef = ref<InstanceType<typeof IuModal>>()

const modalIcon = ref()
const open = ref(false)
const title = ref('')
const form = ref<scheduledTasks>({})
const modalFormItems = ref<IuFormField[]>([
  {
    field: 'task_id',
    label: '任务ID',
    type: FormItemType.text,
  },
  {
    field: 'job_group',
    label: '任务分组',
    type: FormItemType.render,
    renderX: () => h(DictTag, {
      options: props.dicts[dictKey.sysJobGroup],
      value: form.value.job_group,
    }),
  },
  {
    field: 'job_name',
    label: '任务名称',
    type: FormItemType.text,
  },
  {
    field: 'created_at',
    label: '创建时间',
    type: FormItemType.render,
    renderX: () => h('span', parseTime(form.value.created_at)),
  },
  {
    field: 'cron_expression',
    label: 'cron表达式',
    type: FormItemType.text,
  },
  {
    field: 'oper_url',
    label: '请求地址',
    type: FormItemType.text,
  },
  {
    field: 'task_count',
    label: '执行次数',
    type: FormItemType.text,
  },
  {
    field: 'oper_param',
    label: '上次执行',
    type: FormItemType.render,
    renderX: () => h('span', parseTime(form.value.last_time)),
  },
  {
    field: 'next_time',
    label: '下次执行',
    type: FormItemType.render,
    renderX: () => h('span', parseTime(form.value.next_time)),
  },
  {
    field: 'invoke_target',
    label: '调用方法',
    type: FormItemType.text,
  },
  {
    field: 'job_params',
    label: '调用参数',
    type: FormItemType.text,
  },
  {
    field: 'status',
    label: '任务状态',
    type: FormItemType.text,
  },
  {
    field: 'misfire_policy',
    label: '执行策略',
    type: FormItemType.text,
  },
  {
    field: 'remark',
    label: '备注',
    type: FormItemType.text,
    defaultIsOnlyOne: true,
    defaultCol: 2,
    fullScreenIsOnlyOne: true,
    fullScreenCol: 2,
  },
])
function openDetail(row: scheduledTasks) {
  modalIcon.value = h(IconPlus)
  open.value = true
  form.value = { ...row }
  title.value = '任务详情'
}

defineExpose({ openDetail })
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
  />
</template>

<style scoped lang="scss">

</style>
