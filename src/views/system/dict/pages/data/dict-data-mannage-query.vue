<script setup lang="ts">
import { type PropType, computed, ref } from 'vue'
import { ApiSysDictType } from '@/api/sysApis'
import IuQueryForm from '@/components/iui/iu-query-form.vue'
import { type listType, useGet } from '@/hooks'
import { FormItemType, type IuQueryFormField } from '@/types/base/iu-form'
import { type dictDataQueryParam, dictKey, type dictType, type dictUse } from '@/types/system/dict'

defineOptions({ name: 'DictDataManageQuery' })

const props = defineProps({
  dicts: {
    type: Object as PropType<Record<string, dictUse[]>>,
    required: true,
  },
})

const emits = defineEmits(['getList'])

const queryParams = defineModel<dictDataQueryParam>('queryParams', { required: true })
const showSearch = defineModel<boolean>('showSearch', { required: true })

const {
  data: dictTypeList,
} = useGet<listType<dictType>>(
  ApiSysDictType.getList,
  { page_size: Number.MAX_SAFE_INTEGER },
  { immediate: true },
)

const queryFormItems = ref<IuQueryFormField[]>([
  {
    field: 'dict_type',
    label: '字典名称',
    type: FormItemType.select,
    select: {
      placeholder: '请输入字典名称',
      options: computed(() => dictTypeList.value?.list as any[]),
      fieldNames: {
        label: 'dict_name',
        value: 'dict_type',
      },
      allowClear: true,
      allowSearch: true,
    },
  },
  {
    field: 'dict_label',
    label: '字典标签',
    type: FormItemType.input,
    input: {
      placeholder: '请输入字典标签',
      allowClear: true,
    },
  },
  {
    field: 'status',
    label: '字典状态',
    type: FormItemType.select,
    select: {
      placeholder: '请输入字典状态',
      options: computed(() => props.dicts[dictKey.sysNormalDisable]),
      fieldNames: {
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
