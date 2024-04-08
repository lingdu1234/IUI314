<script setup lang="ts">
import { type PropType, computed, markRaw, ref } from 'vue'
import { IconEdit, IconPlus } from '@arco-design/web-vue/es/icon'
import { Message } from '@arco-design/web-vue'
import { useI18n } from 'vue-i18n'
import IuModal from '@/components/iui/iu-modal.vue'
import type { userInfo, userInformation } from '@/types/system/userInformation'
import { FormItemType, type IuFormField, type SelectOptionInterface } from '@/types/base/iu-form'
import { dictKey, type dictUse } from '@/types/system/dict'
import { useGet, usePost, usePut } from '@/hooks'
import { ApiSysPost, ApiSysRole, ApiSysUser } from '@/api/sysApis'
import { ErrorFlag } from '@/api/apis'
import type { MessageSchema } from '@/i18n'
import type { postList } from '@/types/system/post'
import type { roleList } from '@/types/system/role'
import type { dept } from '@/types/system/dept'

defineOptions({ name: 'UserManageModal' })

const props = defineProps({
  deptTree: {
    type: Array as PropType<dept[]>,
    required: true,
  },
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

const modalIcon = ref()
const open = ref(false)
const title = ref('')
const form = ref<userInformation>({})

const roleOptions = ref<SelectOptionInterface[]>([])
const postOptions = ref<SelectOptionInterface[]>([])

const modalFormItems = ref<IuFormField[]>([])
const addFormItems = ref<IuFormField[]>([
  {
    field: 'user_name',
    label: '用户名称',
    type: FormItemType.input,
    placeholder: '请输入用户名称',
    rule: [
      { required: true, message: '用户名称不能为空' },
      { type: 'string', minLength: 2, maxLength: 20, message: '用户名称2~20个字符' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'user_password',
    label: '用户密码',
    type: FormItemType.input,
    placeholder: '请输入用户密码',
    rule: [
      { required: true, message: '用户密码不能为空' },
      { type: 'string', minLength: 2, maxLength: 20, message: '用户密码2~20个字符' },
    ],
    validateTrigger: 'blur',
  },
])
const editFormItems = ref<IuFormField[]>([
  {
    field: 'user_nickname',
    label: '用户昵称',
    type: FormItemType.input,
    placeholder: '请输入用户昵称',
    rule: [
      { required: true, message: '用户昵称不能为空' },
      { type: 'string', minLength: 2, maxLength: 20, message: '用户昵称2~20个字符' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'sex',
    label: '用户性别',
    type: FormItemType.radio,
    placeholder: '请输入用户性别',
    selectOption: {
      dataOption: computed(() => props.dicts[dictKey.sysUserSex]),
      dataOptionKey: {
        label: 'label',
        value: 'value',
      },
      allowClear: true,
      allowSearch: true,
    },
    rule: [
      { required: true, message: '用户性别不能为空' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'dept_ids',
    label: '用户部门',
    type: FormItemType.treeSelect,
    placeholder: '请选择用户部门',
    selectOption: {
      dataOption: props.deptTree,
      dataOptionKey: {
        title: 'dept_name',
        key: 'dept_id',
        children: 'children',
      },
      allowClear: true,
      allowSearch: true,
      multiple: true,
      maxTagCount: 1,
    },
    rule: [
      { required: true, message: '用户部门不能为空' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'dept_id',
    label: '激活部门',
    type: FormItemType.treeSelect,
    placeholder: '请选择激活部门',
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
    },
    rule: [
      { required: true, message: '用户部门不能为空' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'role_ids',
    label: '用户角色',
    type: FormItemType.select,
    placeholder: '请选择用户角色',
    selectOption: {
      dataOption: roleOptions,
      dataOptionKey: {
        title: 'dept_name',
        key: 'dept_id',
        children: 'children',
      },
      allowClear: true,
      allowSearch: true,
      multiple: true,
      maxTagCount: 1,
    },
    rule: [
      { required: true, message: '用户部门不能为空' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'role_id',
    label: '激活角色',
    type: FormItemType.select,
    placeholder: '请选择激活角色',
    selectOption: {
      dataOption: roleOptions,
      dataOptionKey: {
        title: 'dept_name',
        key: 'dept_id',
        children: 'children',
      },
      allowClear: true,
      allowSearch: true,
      multiple: false,
    },
    rule: [
      { required: true, message: '用户部门不能为空' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'phone_num',
    label: '手机号码',
    type: FormItemType.input,
    placeholder: '请输入手机号码',
  },
  {
    field: 'email',
    label: '用户邮箱',
    type: FormItemType.input,
    placeholder: '请输入用户邮箱',
    rule: [
      { required: false, type: 'email', message: '请输入正确的邮箱地址' },
    ],
  },
  {
    field: 'post_ids',
    label: '用户岗位',
    type: FormItemType.select,
    placeholder: '请选择用户岗位',
    selectOption: {
      dataOption: postOptions,
      dataOptionKey: {
        title: 'dept_name',
        key: 'dept_id',
        children: 'children',
      },
      allowClear: true,
      allowSearch: true,
      multiple: true,
      maxTagCount: 1,
    },
    rule: [
      { required: true, message: '用户岗位不能为空' },
    ],
    fullScreenCol: 2,
    defaultCol: 2,
    fullScreenIsOnlyOne: true,
    defaultIsOnlyOne: true,
    validateTrigger: 'blur',
  },
  {
    field: 'is_admin',
    label: '后台用户',
    type: FormItemType.radio,
    selectOption: {
      dataOption: computed(() => props.dicts[dictKey.isAdmin]),
      dataOptionKey: {
        label: 'label',
        value: 'value',
      },
    },
    rule: [
      { required: true, message: '后台用户必须选择' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'user_status',
    label: '用户状态',
    type: FormItemType.radio,
    selectOption: {
      dataOption: computed(() => props.dicts[dictKey.sysNormalDisable]),
      dataOptionKey: {
        label: 'label',
        value: 'value',
      },
    },
    rule: [
      { required: true, message: '用户状态必须选择' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'remark',
    label: '备注',
    type: FormItemType.textarea,
    placeholder: '请输入字典备注',
    fullScreenCol: 2,
    defaultCol: 2,
    fullScreenIsOnlyOne: true,
    defaultIsOnlyOne: true,
  },
])

function handleAdd() {
  modalIcon.value = markRaw(IconPlus)
  open.value = true
  form.value = {
    is_admin: '1',
    user_status: '1',
    sex: '2',
  }
  modalFormItems.value = [...addFormItems.value, ...editFormItems.value]
  title.value = `${t('common.add')}用户`
}
async function handleUpdate(row?: userInformation) {
  modalIcon.value = markRaw(IconEdit)
  modalFormItems.value = [...editFormItems.value]
  open.value = true
  const user_id = row?.id || props.ids[0]
  const { data, execute } = useGet<userInfo>(ApiSysUser.getById, { user_id })
  await execute()
  form.value = data.value?.user_info as userInformation
  form.value.post_ids = data.value?.post_ids
  form.value.role_ids = data.value?.role_ids
  form.value.dept_ids = data.value?.dept_ids
  title.value = `${t('common.update')}用户:${form.value?.user_name}`
}
async function submitForm() {
  if (form.value.id !== undefined) {
    const { execute, data } = usePut(ApiSysUser.edit, form)

    await execute()
    if (data.value === ErrorFlag)
      return
    Message.success(t('commonTip.updateSuccess'))
  }
  else {
    const { execute, data } = usePost(ApiSysUser.add, form)
    await execute()
    if (data.value === ErrorFlag)
      return
    Message.success(t('commonTip.addSuccess'))
  }
  open.value = false
  emits('getList')
}
// 选项初始化
async function optionsInit() {
  const queryParams = {
    page_num: 1,
    page_size: Number.MAX_SAFE_INTEGER,
  }
  const { data: b, execute: be } = useGet<roleList>(
    ApiSysRole.getList,
    queryParams,
  )
  const { data: c, execute: ce } = useGet<postList>(
    ApiSysPost.getList,
    queryParams,
  )
  await Promise.all([be(), ce()])

  const _roleOptions: SelectOptionInterface[] = []
  const _postOptions: SelectOptionInterface[] = []

  b.value?.list!.forEach((it) => {
    const item: SelectOptionInterface = {
      key: it.role_id!,
      label: it.role_name!,
      value: it.role_id!,
      disabled: it.status === '0',
    }
    _roleOptions.push(item)
  })
  c.value?.list!.forEach((it) => {
    const item: SelectOptionInterface = {
      key: it.post_id!,
      label: it.post_name!,
      value: it.post_id!,
      disabled: it.status === '0',
    }
    _postOptions.push(item)
  })

  roleOptions.value = _roleOptions
  postOptions.value = _postOptions
}

optionsInit()
defineExpose({ handleAdd, handleUpdate })
</script>

<template>
  <IuModal
    v-model:visible="open"
    v-model:form-value="form"
    :form-items="modalFormItems"
    :icon="modalIcon"
    :title="title"
    :item-width="250"
    :default-col="2"
    @handle-ok="submitForm"
  />
</template>

<style scoped lang="scss">

</style>
