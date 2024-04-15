<script setup lang="ts">
import { type PropType, computed, ref } from 'vue'
import IuQueryForm from '@/components/iui/iu-query-form.vue'
import { FormItemType, type IuQueryFormField } from '@/types/base/iu-form'
import { type dictDataQueryParam, dictKey, type dictType, type dictUse } from '@/types/system/dict'
import { type listType, useGet } from '@/hooks'
import { ApiSysDictType } from '@/api/sysApis'

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
    placeholder: '请输入字典名称',
    selectOption: {
      dataOption: computed(() => dictTypeList.value?.list as any[]),
      dataOptionKey: {
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
    placeholder: '请输入字典标签',
  },
  {
    field: 'status',
    label: '字典状态',
    type: FormItemType.select,
    placeholder: '请输入字典状态',
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
