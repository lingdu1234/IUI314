<script setup lang="ts">
import { type PropType, computed, ref } from 'vue'
import IuQueryForm from '@/components/iui/iu-query-form.vue'
import { FormItemType, type IuQueryFormField } from '@/types/base/iu-form'
import { dictKey, type dictUse } from '@/types/system/dict'
import type { userQueryParam } from '@/types/system/userInformation'

defineOptions({ name: 'UserManageQuery' })

const props = defineProps({
  dicts: {
    type: Object as PropType<Record<string, dictUse[]>>,
    required: true,
  },
})

const emits = defineEmits(['getList'])

const queryParams = defineModel<userQueryParam>('queryParams', { required: true })
const showSearch = defineModel<boolean>('showSearch', { required: true })

const queryFormItems = ref<IuQueryFormField[]>([
  {
    field: 'user_name',
    label: '用户名称',
    type: FormItemType.input,
    input: {
      placeholder: '请输入用户名称',
      allowClear: true,
    },
  },
  {
    field: 'phone_num',
    label: '电话号码',
    type: FormItemType.input,
    input: {
      placeholder: '请输入电话号码',
      allowClear: true,
    },
  },
  {
    field: 'user_status',
    label: '用户状态',
    type: FormItemType.select,
    select: {
      placeholder: '请输入用户状态',
      options: computed(() => props.dicts[dictKey.sysNormalDisable]),
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

<style scoped lang="scss">

</style>
