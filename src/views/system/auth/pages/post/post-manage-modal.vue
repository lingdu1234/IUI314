<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { IconEdit, IconPlus } from '@arco-design/web-vue/es/icon'
import { type PropType, computed, h, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ErrorFlag } from '@/api/apis'
import { ApiSysPost } from '@/api/sysApis'
import IuModal from '@/components/iui/iu-modal.vue'
import { useGet, usePost, usePut } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { FormItemType, type IuFormField } from '@/types/base/iu-form'
import { dictKey, type dictUse } from '@/types/system/dict'
import type { post } from '@/types/system/post'

defineOptions({ name: 'PostManageModal' })

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
const form = ref<post>({})

const modalFormItems = computed<IuFormField[]>(() => [
  {
    field: 'post_name',
    label: t('sys.postName'),
    type: FormItemType.input,
    input: {
      allowClear: true,
      placeholder: t('sys.postNameTip'),
    },
    rule: [
      { required: true, message: t('sys.postNameValidateTip') },
      { type: 'string', minLength: 2, maxLength: 20, message: t('sys.postNameValidateTip') },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'post_code',
    label: t('sys.postCode'),
    type: FormItemType.input,
    input: {
      allowClear: true,
      placeholder: t('sys.postCodeTip'),
    },
    rule: [
      { required: true, message: t('sys.postCodeValidateTip') },
      { type: 'string', minLength: 2, maxLength: 20, message: t('sys.postCodeValidateTipB') },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'post_sort',
    label: t('sys.order'),
    type: FormItemType.inputNumber,
    inputNumber: {
      mode: 'button',
      placeholder: t('sys.orderTip'),
      min: 1,
      defaultValue: 1,
    },
    rule: [
      { required: true, message: t('sys.orderValidateTip') },
    ],
  },
  {
    field: 'status',
    label: t('sys.postStatus'),
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
      autoSize: true,
      placeholder: t('sys.remarkTip'),
    },
  },
])
function handleAdd() {
  modalIcon.value = h(IconPlus)
  open.value = true
  form.value = {
    status: '1',
  }
  title.value = t('sys.add') + t('sys.post')
}
async function handleUpdate(row?: post) {
  modalIcon.value = h(IconEdit)
  if (row) {
    form.value = { ...row }
  }
  else {
    const post_id = props.ids[0]
    const { data, execute } = useGet<post>(ApiSysPost.getById, { post_id })
    await execute()
    form.value = data.value as post
  }
  title.value = `${t('sys.update') + t('sys.post')}-${form.value.post_name}`
  open.value = true
}
async function submitForm() {
  if (form.value.post_id !== undefined) {
    const { execute, data } = usePut(ApiSysPost.edit, form)

    await execute()
    if (data.value === ErrorFlag)
      return
    Message.success(t('sys.tipUpdateSuccess'))
  }
  else {
    const { execute, data } = usePost(ApiSysPost.add, form)
    await execute()
    if (data.value === ErrorFlag)
      return
    Message.success(t('sys.tipAddSuccess'))
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
    :label-width="100"
    :default-col="1"
    :full-screen-col="1"
    @handle-ok="submitForm"
  />
</template>

<style scoped lang="scss">

</style>
