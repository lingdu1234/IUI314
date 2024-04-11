<script setup lang="ts">
import { type PropType, computed, markRaw, ref } from 'vue'
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

defineOptions({ name: 'RoleManageModal' })

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
    field: 'role_name',
    label: '角色名称',
    type: FormItemType.input,
    placeholder: '请输入角色名称',
    rule: [
      { required: true, message: '角色名称不能为空' },
      { type: 'string', minLength: 2, maxLength: 20, message: '角色名称2~20个字符' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'role_key',
    label: '角色标志',
    type: FormItemType.input,
    placeholder: '请输入角色标志',
    rule: [
      { required: true, message: '角色标志不能为空' },
      { type: 'string', minLength: 2, maxLength: 20, message: '角色标志2~20个字符' },
    ],
    validateTrigger: ['change', 'blur'],
  },
  {
    field: 'list_order',
    label: '角色排序',
    type: FormItemType.inputNumber,
    inputNumberMode: 'button',
    placeholder: '请输入显示排序',
    rule: [
      { required: true, message: '显示排序不能为空' },
    ],
  },
  {
    field: 'status',
    label: '角色状态',
    type: FormItemType.radio,
    selectOption: {
      dataOption: computed(() => props.dicts[dictKey.sysNormalDisable]),
      dataOptionKey: {
        label: 'label',
        value: 'value',
      },
    },
    rule: [
      { required: true, message: '角色状态必须选择' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'checkOption',
    label: '菜单操作',
    type: FormItemType.slot,
    slotName: 'checkOption',
    defaultCol: 2,
    fullScreenCol: 2,
    fullScreenIsOnlyOne: true,
    defaultIsOnlyOne: true,
  },
  {
    field: 'deptTreeSlot',
    label: '菜单权限',
    type: FormItemType.slot,
    slotName: 'deptTreeSlot',
  },
  {
    field: 'remark',
    label: '备注',
    type: FormItemType.textarea,
    placeholder: '请输入字典备注',
    defaultCol: 2,
    fullScreenCol: 2,
    fullScreenIsOnlyOne: true,
    defaultIsOnlyOne: true,
  },
])
function handleAdd() {
  modalIcon.value = markRaw(IconPlus)
  open.value = true
  form.value = {
    status: '1',
  }
  title.value = '添加岗位'
}
async function handleUpdate(row?: post) {
  modalIcon.value = markRaw(IconEdit)
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
    :default-col="2"
    @handle-ok="submitForm"
  >
    <template #checkOption>
      <a-checkbox-group :default-value="['3']">
        <a-checkbox value="1">
          展开/折叠
        </a-checkbox>
        <a-checkbox value="2">
          全选/全不选
        </a-checkbox>
        <a-checkbox value="3">
          父子联动
        </a-checkbox>
      </a-checkbox-group>
    </template>
    <template #deptTreeSlot>
      aaa1111
    </template>
  </IuModal>
</template>

<style scoped lang="scss">

</style>
