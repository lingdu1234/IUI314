<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { IconEdit, IconPlus } from '@arco-design/web-vue/es/icon'
import { type PropType, computed, h, ref } from 'vue'
import { ErrorFlag } from '@/api/apis'
import { ApiSysDictType } from '@/api/sysApis'
import IuModal from '@/components/iui/iu-modal.vue'
import { useGet, usePost, usePut } from '@/hooks'
import { FormItemType, type IuFormField } from '@/types/base/iu-form'
import { dictKey, type dictType, type dictUse } from '@/types/system/dict'

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

const iuModalRef = ref<InstanceType<typeof IuModal>>()

const modalIcon = ref()
const open = ref(false)
const title = ref('')
const form = ref<dictType>({ dict_name: '', dict_type: '', remark: '', status: '1' })

const modalFormItems = computed<IuFormField[]>(() => [
  {
    field: 'dict_name',
    label: '字典名称',
    type: FormItemType.input,
    input: {
      allowClear: true,
      placeholder: '请输入字典名称',
    },
    rule: [
      { required: true, message: '字典名称不能为空' },
      { type: 'string', minLength: 2, maxLength: 50, message: '字典名称2~50个字符' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'dict_type',
    label: '字典类型',
    type: FormItemType.input,
    input: {
      allowClear: true,
      placeholder: '请输入字典类型',
    },
    rule: [
      { required: true, message: '字典类型不能为空' },
      { type: 'string', minLength: 2, maxLength: 50, message: '字典类型2~50个字符' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'status',
    label: '字典状态',
    type: FormItemType.radioGroup,
    radioGroup: {
      placeholder: '请输入字典状态',
      options: computed(() => props.dicts[dictKey.sysNormalDisable]),
    },
    rule: [
      { required: true, message: '字典状态必须选择' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'remark',
    label: '备注',
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
  title.value = '添加字典类型'
}
async function handleUpdate(row?: dictType) {
  modalIcon.value = h(IconEdit)
  const dict_type_id = row?.dict_type_id || props.ids[0]
  const { data, execute } = useGet(ApiSysDictType.getById, { dict_type_id })
  await execute()
  form.value = data.value as dictType
  title.value = `更新字典类型-${form.value.dict_name}`
  open.value = true
}
async function submitForm() {
  if (form.value.dict_type_id !== undefined) {
    const { execute, data } = usePut(ApiSysDictType.edit, form)

    await execute()
    if (data.value === ErrorFlag)
      return
    Message.success(`更新字典类型(${form.value.dict_name})成功`)
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
