<script setup lang="ts">
import { type PropType, computed, ref } from 'vue'
import IuQueryForm from '@/components/iui/iu-query-form.vue'
import type { userQueryParam } from '@/types/system/userInformation'
import { FormItemType, type IuQueryFormField } from '@/types/base/iu-form'
import { dictKey, type dictUse } from '@/types/system/dict'

defineOptions({ name: 'ScheduledTasksQuery' })

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
    field: 'job_name',
    label: '任务名称',
    type: FormItemType.input,
    placeholder: '请输入任务名称',
  },
  {
    field: 'job_group',
    label: '任务组名',
    type: FormItemType.select,
    placeholder: '请选择任务组名',
    selectOption: {
      dataOption: computed(() => props.dicts[dictKey.sysJobGroup]),
      dataOptionKey: {
        label: 'label',
        value: 'value',
      },
      allowClear: true,
      allowSearch: true,
    },
  },
  {
    field: 'status',
    label: '任务状态',
    type: FormItemType.select,
    placeholder: '请选择任务状态',
    selectOption: {
      dataOption: computed(() => props.dicts[dictKey.sysNormalDisable]),
      dataOptionKey: {
        label: 'label',
        value: 'value',
      },
      allowClear: true,
      allowSearch: true,
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
