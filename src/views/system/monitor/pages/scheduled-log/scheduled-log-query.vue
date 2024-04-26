<script setup lang="ts">
import { type PropType, computed, ref } from 'vue'
import { ApiSysScheduledTasks } from '@/api/sysApis'
import IuQueryForm from '@/components/iui/iu-query-form.vue'
import { filterObjectArray, type listType, useGet } from '@/hooks'
import { FormItemType, type IuQueryFormField } from '@/types/base/iu-form'
import { dictKey, type dictUse } from '@/types/system/dict'
import type { scheduledTasks, scheduledTasksLogQueryParam } from '@/types/system/scheduled-tasks'
import type { userQueryParam } from '@/types/system/userInformation'

defineOptions({ name: 'ScheduledLogQuery' })

const props = defineProps({
  dicts: {
    type: Object as PropType<Record<string, dictUse[]>>,
    required: true,
  },
})

const emits = defineEmits(['getList'])
const jobSelect = ref<scheduledTasks[]>([])

const queryParams = defineModel<userQueryParam>('queryParams', { required: true })
const showSearch = defineModel<boolean>('showSearch', { required: true })

async function getJobSelect() {
  const _queryParams: scheduledTasksLogQueryParam = {
    page_num: 1,
    page_size: Number.MAX_SAFE_INTEGER,
  }
  const { data, execute } = useGet<listType<scheduledTasks>>(
    ApiSysScheduledTasks.getList,
    _queryParams,
  )
  await execute()

  // 对菜单进行筛选
  jobSelect.value = filterObjectArray(data.value?.list as scheduledTasks[], ['job_id', 'job_name'], 'children')
}
getJobSelect()

const queryFormItems = ref<IuQueryFormField[]>([
  {
    field: 'job_id',
    label: '任务名称',
    type: FormItemType.select,
    select: {
      placeholder: '请输入任务名称',
      options: jobSelect,
      fieldNames: {
        label: 'job_name',
        value: 'job_id',
      },
      allowClear: true,
      allowSearch: true,
    },
  },
  {
    field: 'status',
    label: '执行状态',
    type: FormItemType.select,
    select: {
      placeholder: '请选择任务执行状态',
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
    field: 'is_once',
    label: '任务属性',
    type: FormItemType.select,
    select: {
      placeholder: '请选择任务属性',
      options: computed(() => props.dicts[dictKey.sysTaskIsOnce]),
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
