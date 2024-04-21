<script setup lang="ts">
import { type PropType, computed, ref } from 'vue'
import IuQueryForm from '@/components/iui/iu-query-form.vue'
import { FormItemType, type IuQueryFormField } from '@/types/base/iu-form'
import { dictKey, type dictUse } from '@/types/system/dict'
import type { loginLogQueryParam } from '@/types/system/login-log'

defineOptions({ name: 'OnlineUserQuery' })

const props = defineProps({
  dicts: {
    type: Object as PropType<Record<string, dictUse[]>>,
    required: true,
  },
})

const emits = defineEmits(['getList'])

const queryParams = defineModel<loginLogQueryParam>('queryParams', { required: true })
const showSearch = defineModel<boolean>('showSearch', { required: true })

const queryFormItems = ref<IuQueryFormField[]>([
  {
    field: 'ip',
    label: '登录 IP',
    type: FormItemType.input,
    placeholder: '请输入登录IP',
  },
  {
    field: 'user_name',
    label: '登录名称',
    type: FormItemType.input,
    placeholder: '请输入登录名称',
  },
  {
    field: 'status',
    label: '登录状态',
    type: FormItemType.select,
    placeholder: '请输入登录状态',
    selectOption: {
      dataOption: computed(() => props.dicts[dictKey.sysCommonStatus]),
      dataOptionKey: {
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
    placeholder: '请输入开始日期',
  },
  {
    field: 'end_time',
    label: '结束日期',
    type: FormItemType.datePicker,
    placeholder: '请输入结束日期',
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

<style scoped lang="scss">

</style>
