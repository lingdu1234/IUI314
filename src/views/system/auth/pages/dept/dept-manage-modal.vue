<script setup lang="ts">
import { Message, Modal } from '@arco-design/web-vue'
import { IconEdit, IconPlus } from '@arco-design/web-vue/es/icon'
import { type Component, type PropType, computed, h, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ErrorFlag } from '@/api/apis'
import { ApiSysDept } from '@/api/sysApis'
import IuModal from '@/components/iui/iu-modal.vue'
import { useDelete, usePost, usePut } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { FormItemType, type IuFormField } from '@/types/base/iu-form'
import type { dept } from '@/types/system/dept'
import { dictKey, type dictUse } from '@/types/system/dict'

defineOptions({ name: 'DeptManageModal' })

const props = defineProps({
  deptTree: {
    type: Array as PropType<dept[]>,
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

const modalIcon = ref<Component>()
const open = ref(false)
const title = ref('')
const form = ref<dept>({})

const modalFormItems = computed<IuFormField[]>(() => [
  {
    field: 'parent_id',
    label: `${t('sys.deptParent')}`,
    type: FormItemType.treeSelect,
    treeSelect: {
      placeholder: t('sys.deptParentTip'),
      data: props.deptTree,
      fieldNames: {
        title: 'dept_name',
        key: 'dept_id',
        children: 'children',
      },
      allowClear: true,
      allowSearch: true,
      multiple: false,
      maxTagCount: 1,
    },
    rule: [
      { required: true, message: t('sys.deptParentValidateTip') },
    ],
    validateTrigger: ['blur', 'change'],
  },
  {
    field: 'dept_name',
    label: t('sys.deptName'),
    type: FormItemType.input,
    input: {
      allowClear: true,
      placeholder: t('sys.deptNameTip'),
    },
    rule: [
      { required: true, message: t('sys.deptNameValidateTip') },
      { type: 'string', minLength: 1, maxLength: 20, message: t('sys.deptNameValidateTipB') },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'order_num',
    label: t('sys.order'),
    type: FormItemType.inputNumber,
    inputNumber: {
      mode: 'button',
      min: 1,
      defaultValue: 1000,
      placeholder: t('sys.orderTip'),
    },
    rule: [
      { required: true, message: t('sys.orderValidateTip') },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'leader',
    label: t('sys.leader'),
    type: FormItemType.input,
    input: {
      placeholder: t('sys.leaderTip'),
      allowClear: true,
    },
  },
  {
    field: 'phone',
    label: t('sys.phone'),
    type: FormItemType.input,
    input: {
      allowClear: true,
      placeholder: t('sys.phoneTip'),
    },
  },
  {
    field: 'email',
    label: t('sys.email'),
    type: FormItemType.input,
    input: {
      allowClear: true,
      placeholder: t('sys.emailTip'),
    },
  },
  {
    field: 'status',
    label: t('sys.deptStatus'),
    type: FormItemType.radioGroup,
    radioGroup: {
      options: computed(() => props.dicts[dictKey.sysNormalDisable]),
    },
    rule: [
      { required: true, message: t('sys.deptStatusValidateTip') },
    ],
    validateTrigger: 'blur',
  },
])

function handleAdd(row?: dept) {
  modalIcon.value = h(IconPlus)
  open.value = true
  if (row)
    form.value.parent_id = row.dept_id
  form.value.status = '1'
  title.value = `${t('sys.add')}${t('sys.dept')}`
}
async function handleUpdate(row?: dept) {
  modalIcon.value = h(IconEdit)
  open.value = true
  form.value = { ...row } as dept
  title.value = `${t('sys.update')}${t('sys.dept')}:${form.value?.dept_name}`
}

function handleDelete(row?: dept) {
  const name = row && row.dept_name
  Modal.warning({
    title: t('sys.deleteConfirm'),
    hideCancel: false,
    titleAlign: 'start',
    content: `${t('sys.tipDelete') + name}?`,
    okText: t('app.confirm'),
    cancelText: t('app.cancel'),
    draggable: true,
    onOk: async () => {
      const query = ref<{ [key: string]: any }>({})
      query.value.dept_id = row?.dept_id
      const { execute } = useDelete(ApiSysDept.delete, query)
      await execute()
      Message.success(t('sys.tipDeleteSuccess') + name)
      emits('getList')
    },
    onCancel: async () => Message.info(t('sys.tipDeleteCancel')),
  })
}
async function submitForm() {
  if (form.value.dept_id !== undefined) {
    const { execute, data } = usePut(ApiSysDept.edit, form)

    await execute()
    if (data.value === ErrorFlag)
      return
    Message.success(t('sys.tipUpdateSuccess'))
  }
  else {
    const { execute, data } = usePost(ApiSysDept.add, form)
    await execute()
    if (data.value === ErrorFlag)
      return
    Message.success(t('sys.tipAddSuccess'))
  }
  open.value = false
  emits('getList')
}

defineExpose({ handleAdd, handleUpdate, handleDelete })
</script>

<template>
  <IuModal
    ref="iuModalRef"
    v-model:visible="open"
    v-model:form-value="form"
    :form-items="modalFormItems"
    :icon="modalIcon"
    :title="title"
    :item-width="300"
    :label-width="100"
    :default-col="1"
    :full-screen-col="1"
    @handle-ok="submitForm"
  />
</template>

<style scoped lang="scss">

</style>
