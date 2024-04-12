<script setup lang="ts">
import { type Component, type PropType, computed, h, ref } from 'vue'
import { IconEdit, IconPlus } from '@arco-design/web-vue/es/icon'
import { Message, Modal } from '@arco-design/web-vue'
import { useI18n } from 'vue-i18n'
import IuModal from '@/components/iui/iu-modal.vue'
import { FormItemType, type IuFormField } from '@/types/base/iu-form'
import { dictKey, type dictUse } from '@/types/system/dict'
import { useDelete, usePost, usePut } from '@/hooks'
import { ApiSysDept } from '@/api/sysApis'
import { ErrorFlag } from '@/api/apis'
import type { MessageSchema } from '@/i18n'
import type { dept } from '@/types/system/dept'

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

const modalFormItems = ref<IuFormField[]>([
  {
    field: 'parent_id',
    label: '上级部门',
    type: FormItemType.treeSelect,
    placeholder: '请选择上级部门',
    selectOption: {
      dataOption: props.deptTree,
      dataOptionKey: {
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
      { required: true, message: '上级部门不能为空' },
    ],
    validateTrigger: ['blur', 'change'],
  },
  {
    field: 'dept_name',
    label: '部门名称',
    type: FormItemType.input,
    placeholder: '请输入部门名称',
    rule: [
      { required: true, message: '部门名称不能为空' },
      { type: 'string', minLength: 1, maxLength: 20, message: '部门名称1~20个字符' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'order_num',
    label: '显示排序',
    type: FormItemType.inputNumber,
    inputNumberMode: 'button',
    placeholder: '请输入显示排序',
    rule: [
      { required: true, message: '显示排序不能为空' },
    ],
  },
  {
    field: 'leader',
    label: '负责人',
    type: FormItemType.input,
    placeholder: '请输入负责人',
  },
  {
    field: 'phone',
    label: '联系电话',
    type: FormItemType.input,
    placeholder: '请输入联系电话',
  },
  {
    field: 'email',
    label: '邮箱',
    type: FormItemType.input,
    placeholder: '请输入邮箱',
  },
  {
    field: 'status',
    label: '部门状态',
    type: FormItemType.radio,
    selectOption: {
      dataOption: computed(() => props.dicts[dictKey.sysNormalDisable]),
      dataOptionKey: {
        label: 'label',
        value: 'value',
      },
    },
    rule: [
      { required: true, message: '部门状态必须选择' },
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
  title.value = `${t('common.add')}部门`
}
async function handleUpdate(row?: dept) {
  modalIcon.value = h(IconEdit)
  open.value = true
  form.value = { ...row } as dept
  title.value = `${t('common.update')}部门:${form.value?.dept_name}`
}

function handleDelete(row?: dept) {
  const name = row && row.dept_name
  Modal.warning({
    title: '删除确认',
    hideCancel: false,
    titleAlign: 'start',
    content: `${t('commonTip.delete') + name}`,
    okText: '确认',
    cancelText: '取消',
    draggable: true,
    onOk: async () => {
      const query = ref<{ [key: string]: any }>({})
      query.value.dept_id = row?.dept_id
      const { execute } = useDelete(ApiSysDept.delete, query)
      await execute()
      Message.success(t('commonTip.deleteSuccess'))
      emits('getList')
    },
    onCancel: async () => Message.info(t('commonTip.deleteCancel')),
  })
}
async function submitForm() {
  if (form.value.dept_id !== undefined) {
    const { execute, data } = usePut(ApiSysDept.edit, form)

    await execute()
    if (data.value === ErrorFlag)
      return
    Message.success(t('commonTip.updateSuccess'))
  }
  else {
    const { execute, data } = usePost(ApiSysDept.add, form)
    await execute()
    if (data.value === ErrorFlag)
      return
    Message.success(t('commonTip.addSuccess'))
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
    :item-width="250"
    :default-col="1"
    :full-screen-col="1"
    @handle-ok="submitForm"
  />
</template>

<style scoped lang="scss">

</style>
