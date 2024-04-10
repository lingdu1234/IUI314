<script setup lang="ts">
import { type PropType, computed, ref } from 'vue'
import IuQueryForm from '@/components/iui/iu-query-form.vue'
import type { userQueryParam } from '@/types/system/userInformation'
import { FormItemType, type IuQueryFormField } from '@/types/base/iu-form'
import { dictKey, type dictUse } from '@/types/system/dict'

defineOptions({ name: 'PostManageQuery' })

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
    field: 'post_code',
    label: '岗位编码',
    type: FormItemType.input,
    placeholder: '请输入岗位编码',
  },
  {
    field: 'post_name',
    label: '岗位名称',
    type: FormItemType.input,
    placeholder: '请输入岗位名称',
  },
  {
    field: 'status',
    label: '岗位状态',
    type: FormItemType.select,
    placeholder: '请输入岗位状态',
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
