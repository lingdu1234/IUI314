<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { IconEdit, IconPlus } from '@arco-design/web-vue/es/icon'
import { type PropType, computed, h, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ErrorFlag } from '@/api/apis'
import { ApiSysDictType } from '@/api/sysApis'
import IuModal from '@/components/iui/iu-modal.vue'
import { useGet, usePost, usePut } from '@/hooks'
import { FormItemType, type IuFormField } from '@/types/base/iu-form'
import { dictKey, type dictType, type dictUse } from '@/types/system/dict'
import type { MessageSchema } from '@/i18n'

defineOptions({ name: 'DictTypeManageModal' })

const props = defineProps({
  ids: {
    type: Array as PropType<string[]>,
    required: true,
  },
  dicts: {
    type: Object as PropType<Record<string, dictUse[]>>,
    required: true,
  },
})

const emits = defineEmits(['getList'])
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const iuModalRef = ref<InstanceType<typeof IuModal>>()

const modalIcon = ref()
const open = ref(false)
const title = ref('')
const form = ref<dictType>({ dict_name: '', dict_type: '', remark: '', status: '1' })

const modalFormItems = computed<IuFormField[]>(() => [
  {
    field: 'dict_name',
    label: t('sys.dictName'),
    type: FormItemType.input,
    input: {
      allowClear: true,
      placeholder: t('sys.dictNameTip'),
    },
    rule: [
      { required: true, message: t('sys.dictNameValidateTipA') },
      { type: 'string', minLength: 2, maxLength: 50, message: t('sys.dictNameValidateTipB') },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'dict_type',
    label: t('sys.dictType'),
    type: FormItemType.input,
    input: {
      allowClear: true,
      placeholder: t('sys.dictTypeTip'),
    },
    rule: [
      { required: true, message: t('sys.dictTypeValidateTipA') },
      { type: 'string', minLength: 2, maxLength: 50, message: t('sys.dictTypeValidateTipB') },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'status',
    label: t('sys.dictStatus'),
    type: FormItemType.radioGroup,
    radioGroup: {
      options: computed(() => props.dicts[dictKey.sysNormalDisable]),
    },
    rule: [
      { required: true },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'remark',
    label: t('sys.remark'),
    type: FormItemType.textarea,
    textArea: {
      allowClear: true,
      placeholder: '请输入字典备注',
      autoSize: true,
    },
    fullScreenCol: 2,
    fullScreenIsOnlyOne: true,
  },
])
function handleAdd() {
  modalIcon.value = h(IconPlus)
  open.value = true
  form.value.dict_type_id = undefined
  title.value = t('sys.add') + t('sys.dictType')
}
async function handleUpdate(row?: dictType) {
  modalIcon.value = h(IconEdit)
  const dict_type_id = row?.dict_type_id || props.ids[0]
  const { data, execute } = useGet(ApiSysDictType.getById, { dict_type_id })
  await execute()
  form.value = data.value as dictType
  title.value = `${t('sys.update') + t('sys.dictType')}-${form.value.dict_name}`
  open.value = true
}
async function submitForm() {
  if (form.value.dict_type_id !== undefined) {
    const { execute, data } = usePut(ApiSysDictType.edit, form)

    await execute()
    if (data.value === ErrorFlag)
      return
    Message.success(`${t('sys.update') + t('sys.dictType')} (${form.value.dict_name}) ${t('sys.success')}`)
  }
  else {
    const { execute, data } = usePost(ApiSysDictType.add, form)
    await execute()
    if (data.value === ErrorFlag)
      return
    Message.success(`添加字典类型(${form.value.dict_name})成功`)
  }
  open.value = false
  emits('getList')
}

defineExpose({ handleAdd, handleUpdate })
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
    :default-col="1"
    @handle-ok="submitForm"
  />
</template>

<style scoped lang="scss">

</style>
