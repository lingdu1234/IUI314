<script setup lang="ts">
import { type PropType, computed, h, ref } from 'vue'
import { IconEdit, IconPlus } from '@arco-design/web-vue/es/icon'
import { Message } from '@arco-design/web-vue'
import { useI18n } from 'vue-i18n'
import IuModal from '@/components/iui/iu-modal.vue'
import { FormItemType, type IuFormField } from '@/types/base/iu-form'
import { dictKey, type dictUse } from '@/types/system/dict'
import { useGet, usePost, usePut } from '@/hooks'
import { ApiSysPost } from '@/api/sysApis'
import { ErrorFlag } from '@/api/apis'
import type { MessageSchema } from '@/i18n'
import type { post } from '@/types/system/post'

defineOptions({ name: 'ApiManageModal' })

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

const modalFormItems = ref<IuFormField[]>([
  {
    field: 'post_name',
    label: '岗位名称',
    type: FormItemType.input,
    placeholder: '请输入岗位名称',
    rule: [
      { required: true, message: '岗位名称不能为空' },
      { type: 'string', minLength: 2, maxLength: 20, message: '岗位名称2~20个字符' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'post_code',
    label: '岗位编码',
    type: FormItemType.input,
    placeholder: '请输入岗位编码',
    rule: [
      { required: true, message: '岗位编码不能为空' },
      { type: 'string', minLength: 2, maxLength: 20, message: '岗位编码2~20个字符' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'post_sort',
    label: '显示排序',
    type: FormItemType.inputNumber,
    inputNumberMode: 'button',
    placeholder: '请输入显示排序',
    rule: [
      { required: true, message: '显示排序不能为空' },
    ],
  },
  {
    field: 'status',
    label: '岗位状态',
    type: FormItemType.radio,
    selectOption: {
      dataOption: computed(() => props.dicts[dictKey.sysNormalDisable]),
      dataOptionKey: {
        label: 'label',
        value: 'value',
      },
    },
    rule: [
      { required: true, message: '岗位状态必须选择' },
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
  open.value = true
  form.value = {
    status: '1',
  }
  title.value = '添加岗位'
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
  title.value = `更新岗位-${form.value.post_name}`
  open.value = true
}
async function submitForm() {
  if (form.value.post_id !== undefined) {
    const { execute, data } = usePut(ApiSysPost.edit, form)

    await execute()
    if (data.value === ErrorFlag)
      return
    Message.success(t('commonTip.updateSuccess'))
  }
  else {
    const { execute, data } = usePost(ApiSysPost.add, form)
    await execute()
    if (data.value === ErrorFlag)
      return
    Message.success(t('commonTip.addSuccess'))
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
