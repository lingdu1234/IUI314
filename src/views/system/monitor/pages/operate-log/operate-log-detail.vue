<script setup lang="ts">
import { IconEye } from '@arco-design/web-vue/es/icon'
import { type PropType, h, ref } from 'vue'
import DictTag from '@/components/common/dict-tag.vue'
import IuModal from '@/components/iui/iu-modal.vue'
import { FormItemType, type IuFormField } from '@/types/base/iu-form'
import { dictKey, type dictUse } from '@/types/system/dict'
import type { operateLog } from '@/types/system/operate-log'

defineOptions({ name: 'OperateLogDetail' })

const props = defineProps({
  dicts: {
    type: Object as PropType<Record<string, dictUse[]>>,
    required: true,
  },
})

const iuModalRef = ref<InstanceType<typeof IuModal>>()

const modalIcon = ref()
const open = ref(false)
const title = ref('')
const form = ref<operateLog>({})
const modalFormItems = ref<IuFormField[]>([
  {
    field: 'title',
    label: '操作模块',
    type: FormItemType.text,
  },
  {
    field: 'request_method',
    label: '请求方式',
    type: FormItemType.text,
  },
  {
    field: 'oper_name',
    label: '操作人',
    type: FormItemType.text,
  },
  {
    field: 'oper_ip',
    label: '操作IP',
    type: FormItemType.text,
  },
  {
    field: 'oper_location',
    label: '操作地址',
    type: FormItemType.text,
  },
  {
    field: 'oper_url',
    label: '请求地址',
    type: FormItemType.text,
  },
  {
    field: 'method',
    label: '操作方法',
    type: FormItemType.text,
  },
  {
    field: 'oper_param',
    label: '请求参数',
    type: FormItemType.text,
  },
  {
    field: 'path_param',
    label: '路径参数',
    type: FormItemType.text,
  },
  {
    field: 'duration',
    label: '耗时(μs)',
    type: FormItemType.text,
  },
  {
    field: 'status',
    label: '操作状态',
    type: FormItemType.render,
    renderX: () => h(DictTag, {
      options: props.dicts[dictKey.sysCommonStatus],
      value: form.value.status,
    }),
  },
  {
    field: 'oper_time',
    label: '操作时间',
    type: FormItemType.text,
  },
  {
    field: 'error_msg',
    label: '异常信息',
    type: FormItemType.text,
  },
  {
    field: 'json_result',
    label: '返回结果',
    type: FormItemType.textarea,
    disabled: true,
    textAreaAutoSize: true,
    defaultIsOnlyOne: true,
    defaultCol: 2,
    fullScreenIsOnlyOne: true,
    fullScreenCol: 2,
  },
])
function openDetail(row: operateLog) {
  modalIcon.value = h(IconEye)
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
