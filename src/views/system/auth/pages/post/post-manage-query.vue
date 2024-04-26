<script setup lang="ts">
import { type PropType, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import IuQueryForm from '@/components/iui/iu-query-form.vue'
import type { MessageSchema } from '@/i18n'
import { FormItemType, type IuQueryFormField } from '@/types/base/iu-form'
import { dictKey, type dictUse } from '@/types/system/dict'
import type { userQueryParam } from '@/types/system/userInformation'

defineOptions({ name: 'PostManageQuery' })

const props = defineProps({
  dicts: {
    type: Object as PropType<Record<string, dictUse[]>>,
    required: true,
  },
})

const emits = defineEmits(['getList'])
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const queryParams = defineModel<userQueryParam>('queryParams', { required: true })
const showSearch = defineModel<boolean>('showSearch', { required: true })

const queryFormItems = computed<IuQueryFormField[]>(() => [
  {
    field: 'post_code',
    label: t('sys.postCode'),
    type: FormItemType.input,
    input: {
      placeholder: t('sys.postCodeTip'),
      allowClear: true,
    },

  },
  {
    field: 'post_name',
    label: t('sys.postName'),
    type: FormItemType.input,
    input: {
      placeholder: t('sys.postNameTip'),
      allowClear: true,
    },
  },
  {
    field: 'status',
    label: t('sys.postStatus'),
    type: FormItemType.select,
    select: {
      placeholder: t('sys.postStatusTip'),
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
