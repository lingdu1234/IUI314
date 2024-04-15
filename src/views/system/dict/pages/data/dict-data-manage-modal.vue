<script setup lang="ts">
import { type PropType, computed, h, ref } from 'vue'
import { IconEdit, IconPlus } from '@arco-design/web-vue/es/icon'
import { Message } from '@arco-design/web-vue'
import IuModal from '@/components/iui/iu-modal.vue'
import { FormItemType, type IuFormField } from '@/types/base/iu-form'
import { type dictData, dictKey, type dictUse } from '@/types/system/dict'
import { useGet, usePost, usePut } from '@/hooks'
import { ApiSysDictData } from '@/api/sysApis'
import { ErrorFlag } from '@/api/apis'

defineOptions({ name: 'DictDataManageModal' })

const props = defineProps({
  ids: {
    type: Array as PropType<string[]>,
    required: true,
  },
  dictType: {
    type: String,
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
const form = ref<dictData>({
  status: '1',
  dict_sort: 1,
  is_default: 'N',
})

const colors = [
  'orangered',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'arcoblue',
  'purple',
  'pinkpurple',
  'magenta',
  'gray',
]
const listClassOptions = computed(() =>
  colors.map((item) => {
    return {
      label: item,
      value: item,
    }
  }))

const modalFormItems = ref<IuFormField[]>([
  {
    field: 'dict_type',
    label: '字典类型',
    type: FormItemType.input,
    placeholder: '请输入字典类型',
    disabled: true,
  },
  {
    field: 'dict_label',
    label: '字典标签',
    type: FormItemType.input,
    placeholder: '请输入数据标签',
    rule: [
      { required: true, message: '数据标签不能为空' },
      { type: 'string', minLength: 1, maxLength: 20, message: '数据标签1~20个字符' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'dict_value',
    label: '字典键值',
    type: FormItemType.input,
    placeholder: '请输入字典键值',
    rule: [
      { required: true, message: '字典键值不能为空' },
      { type: 'string', minLength: 1, maxLength: 20, message: '字典键值1~20个字符' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'dict_sort',
    label: '显示排序',
    type: FormItemType.inputNumber,
    inputNumberMode: 'button',
    placeholder: '请输入显示排序',
    rule: [
      { required: true, message: '显示排序不能为空' },
    ],
  },
  {
    field: 'css_class',
    label: '样式属性',
    type: FormItemType.slot,
    slotName: 'cssColor',
    placeholder: '请输入样式属性',
  },
  {
    field: 'list_class',
    label: '回显样式',
    type: FormItemType.select,
    placeholder: '请输入回显样式',
    selectOption: {
      dataOption: listClassOptions,
      dataOptionKey: {
        label: 'label',
        value: 'value',
      },
      allowClear: true,
      allowSearch: true,
    },
  },
  {
    field: 'status',
    label: '字典状态',
    type: FormItemType.radio,
    placeholder: '请输入字典状态',
    selectOption: {
      dataOption: computed(() => props.dicts[dictKey.sysNormalDisable]),
      dataOptionKey: {
        label: 'label',
        value: 'value',
      },
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
    placeholder: '请输入字典备注',
  },
])
function handleAdd() {
  modalIcon.value = h(IconPlus)
  form.value.dict_type = props.dictType
  title.value = '添加字典数据'
  open.value = true
}
async function handleUpdate(row?: dictData) {
  modalIcon.value = h(IconEdit)
  const dict_data_id = row?.dict_data_id || props.ids[0]
  const { data, execute } = useGet(ApiSysDictData.getById, { dict_data_id })
  await execute()
  form.value = data.value as dictData
  title.value = `更新字典数据-${form.value.dict_label}`
  open.value = true
}
async function submitForm() {
  if (form.value.dict_data_id !== undefined) {
    const { execute, data } = usePut(ApiSysDictData.edit, form)

    await execute()
    if (data.value === ErrorFlag)
      return
    Message.success(`更新字典数据${form.value.dict_label})成功`)
  }
  else {
    const { execute, data } = usePost(ApiSysDictData.add, form)
    await execute()
    if (data.value === ErrorFlag)
      return
    Message.success(`添加字典数据(${form.value.dict_label})成功`)
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
  >
    <template #cssColor>
      <a-input v-model="form.css_class" allow-clear>
        <template #prepend>
          <a-color-picker
            v-model="form.css_class"
            show-preset
            show-history
          />
        </template>
      </a-input>
    </template>
  </IuModal>
</template>

<style scoped lang="scss">

</style>
