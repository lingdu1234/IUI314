<script setup lang="ts">
import { type PropType, computed, ref } from 'vue'
import IuQueryForm from '@/components/iui/iu-query-form.vue'
import { FormItemType, type IuQueryFormField } from '@/types/base/iu-form'
import { dictKey, type dictUse } from '@/types/system/dict'
import type { operateLogQueryParam } from '@/types/system/operate-log'

defineOptions({ name: 'OperateLogQuery' })

const props = defineProps({
  dicts: {
    type: Object as PropType<Record<string, dictUse[]>>,
    required: true,
  },
})

const emits = defineEmits(['getList'])

const queryParams = defineModel<operateLogQueryParam>('queryParams', { required: true })
const showSearch = defineModel<boolean>('showSearch', { required: true })

const queryFormItems = ref<IuQueryFormField[]>([
  {
    field: 'title',
    label: '系统模块',
    type: FormItemType.input,
    input: {
      allowClear: true,
      placeholder: '请输入系统模块',
    },
  },
  {
    field: 'oper_name',
    label: '操作人员',
    type: FormItemType.input,
    input: {
      allowClear: true,
      placeholder: '请输入操作人员',
    },
  },
  {
    field: 'operator_type',
    label: '操作类型',
    type: FormItemType.input,
    input: {
      allowClear: true,
      placeholder: '请输入操作类型',
    },
  },
  {
    field: 'status',
    label: '操作状态',
    type: FormItemType.select,
    select: {
      placeholder: '请输入登录状态',
      options: computed(() => props.dicts[dictKey.sysCommonStatus]),
      fieldNames: {
        label: 'label',
        value: 'value',
      },
      allowClear: true,
      allowSearch: true,
    },
  },
  {
    field: 'begin_time',
    label: '开始日期',
    type: FormItemType.datePicker,
    datePicker: {
      placeholder: '请输入开始日期',
    },
  },
  {
    field: 'end_time',
    label: '结束日期',
    type: FormItemType.datePicker,
    datePicker: {
      placeholder: '请输入结束日期',
    },
  },
])
</script>

<template>
  <IuQueryForm
    v-show="showSearch"
    v-model:form-value="queryParams"
    v-model:form-items="queryFormItems"
    @query="emits('getList')"
  />
</template>
