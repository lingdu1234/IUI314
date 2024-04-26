<script setup lang="ts">
import type { Tree } from '@arco-design/web-vue'
import { Message } from '@arco-design/web-vue'
import { IconEdit, IconPlus } from '@arco-design/web-vue/es/icon'
import { type PropType, computed, h, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ErrorFlag } from '@/api/apis'
import { ApiSysMenu, ApiSysRole } from '@/api/sysApis'
import IuModal from '@/components/iui/iu-modal.vue'
import { filterObjectArray, useGet, usePost, usePut } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { FormItemType, type IuFormField } from '@/types/base/iu-form'
import { dictKey, type dictUse } from '@/types/system/dict'
import type { menu } from '@/types/system/menu'
import type { role } from '@/types/system/role'

defineOptions({ name: 'RoleManageDataModal' })

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

const menuTree = ref()
const menuTreeRef = ref<InstanceType<typeof Tree>>()
const checkStrictly = ref<boolean>(true)

const modalIcon = ref()
const open = ref(false)
const title = ref('')
const form = ref<role>({})

const modalFormItems = computed<IuFormField[]>(() => [
  {
    field: 'role_name',
    label: t('sys.roleName'),
    type: FormItemType.input,
    input: {
      allowClear: true,
      placeholder: t('sys.roleNameTip'),
    },
    rule: [
      { required: true, message: t('sys.roleNameValidateTip') },
      { type: 'string', minLength: 2, maxLength: 20, message: t('sys.roleNameValidateTipB') },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'role_key',
    label: t('sys.roleKey'),
    type: FormItemType.input,
    input: {
      allowClear: true,
      placeholder: t('sys.roleKeyTip'),
    },
    rule: [
      { required: true, message: t('sys.roleKeyValidateTip') },
      { type: 'string', minLength: 2, maxLength: 20, message: t('sys.roleKeyValidateTipB') },
    ],
    validateTrigger: ['change', 'blur'],
  },
  {
    field: 'list_order',
    label: t('sys.order'),
    type: FormItemType.inputNumber,
    inputNumber: {
      mode: 'button',
      min: 1,
      defaultValue: 1,
    },
    rule: [
      { required: true, message: t('sys.orderValidateTip') },
    ],
  },
  {
    field: 'status',
    label: t('sys.roleStatus'),
    type: FormItemType.radioGroup,
    radioGroup: {
      options: computed(() => props.dicts[dictKey.sysNormalDisable]),
    },
    rule: [
      { required: true, message: t('sys.roleStatusValidateTip') },
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
    field: 'menuTreeSlot',
    label: '菜单权限',
    type: FormItemType.slot,
    slotName: 'menuTreeSlot',
    defaultCol: 2,
    fullScreenCol: 2,
    fullScreenIsOnlyOne: true,
    defaultIsOnlyOne: true,
  },
  {
    field: 'remark',
    label: t('sys.remark'),
    type: FormItemType.textarea,
    textArea: {
      autoSize: true,
      placeholder: t('sys.remarkTip'),
    },
    defaultCol: 2,
    fullScreenCol: 2,
    fullScreenIsOnlyOne: true,
    defaultIsOnlyOne: true,
  },
])

function handleAdd() {
  modalIcon.value = h(IconPlus)
  open.value = true
  form.value = {
    status: '1',
    remark: '',
  }
  title.value = t('sys.add') + t('sys.role')
}
async function checkedMenu(role_id: string) {
  // 获取角色的菜单权限
  const { data, execute } = useGet<string[]>(
    ApiSysRole.getRoleMenus,
    { role_id },
  )
  await execute()
  // 设置选择节点
  form.value.menu_ids = data.value!
}

async function handleUpdate(row?: role) {
  modalIcon.value = h(IconEdit)

  const role_id = (row && row.role_id) || props.ids[0]
  const { data, execute } = useGet<role>(ApiSysRole.getById, { role_id })
  await execute()
  form.value = data.value as role
  title.value = `${t('sys.update') + t('sys.role')}-${form.value.role_name}`
  // 查询权限并勾选
  open.value = true
  await checkedMenu(form.value.role_id as string)
}

async function submitForm() {
  if (form.value.role_id !== undefined) {
    const { execute, data } = usePut(ApiSysRole.edit, form)
    await execute()
    if (data.value === ErrorFlag)
      return
    Message.success(t('sys.tipUpdateSuccess'))
  }
  else {
    const { execute, data } = usePost(ApiSysRole.add, form)
    await execute()
    if (data.value === ErrorFlag)
      return
    Message.success(t('sys.tipAddSuccess'))
  }
  open.value = false
  emits('getList')
}

async function getMenuTree() {
  const { data, execute } = useGet<menu[]>(
    ApiSysMenu.getEnabledTree,
  )
  await execute()
  menuTree.value = filterObjectArray(data.value!, ['id', 'menu_name'], 'children')
}

getMenuTree()

const fieldNames = {
  key: 'id',
  title: 'menu_name',
  children: 'children',
}

function changeMenuExpand(v: boolean | (string | number | boolean)[]) {
  menuTreeRef.value?.expandAll(v as boolean)
}

function changeMenuCheckAll(v: boolean | (string | number | boolean)[]) {
  menuTreeRef.value?.checkAll(v as boolean)
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
    :item-width="200"
    :default-col="2"
    @handle-ok="submitForm"
  >
    <template #checkOption>
      <a-space direction="horizontal">
        <a-checkbox @change="changeMenuExpand">
          展开/折叠
        </a-checkbox>
        <a-checkbox @change="changeMenuCheckAll">
          全选/全不选
        </a-checkbox>
        <a-checkbox v-model="checkStrictly">
          父子联动
        </a-checkbox>
      </a-space>
    </template>
    <template #menuTreeSlot>
      <a-tree
        ref="menuTreeRef"
        v-model:checked-keys="form.menu_ids"
        :checkable="true"
        :field-names="fieldNames"
        :check-strictly="!checkStrictly"
        show-line
        :data="menuTree"
      />
    </template>
  </IuModal>
</template>

<style scoped lang="scss">

</style>
