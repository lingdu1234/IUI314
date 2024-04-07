import { Message, Modal, type TableColumnData } from '@arco-design/web-vue'
import { computed, h, markRaw, ref } from 'vue'
import { IconDelete, IconEdit, IconPlus } from '@arco-design/web-vue/es/icon'
import { useI18n } from 'vue-i18n'
import md5 from 'blueimp-md5'
import type { Handler } from 'mitt'
import type { IuFormField, IuQueryFormField, SelectOptionInterface } from '@/types/base/iu-form'
import { FormItemType } from '@/types/base/iu-form'
import { dictKey, type dictType } from '@/types/system/dict'
import {
  emitter,
  hasPermission,
  type listType,
  parseTime,
  useDeleteFn,
  useDicts,
  useGet,
  usePost,
  usePut,
  useTableUtil,
} from '@/hooks'
import { ApiSysDictType, ApiSysPost, ApiSysRole, ApiSysUser } from '@/api/sysApis'
import type { MessageSchema } from '@/i18n'
import DictTag from '@/components/common/dict-tag.vue'
import type { resetUserPwd, userInfo, userInformation, userQueryParam } from '@/types/system/userInformation'
import ResetPwd from '@/views/system/auth/pages/resetPwd.vue'
import { ErrorFlag } from '@/api/apis'
import type { dept } from '@/types/system/dept'
import type { roleList } from '@/types/system/role'
import type { postList } from '@/types/system/post'

const deptTree = ref<dept[]>([])
const roleOptions = ref<SelectOptionInterface[]>([])
const postOptions = ref<SelectOptionInterface[]>([])

emitter.on('dept_tree', ((v: dept[]) => {
  deptTree.value = v
}) as Handler)

export function useUserForm() {
  const dicts = useDicts(
    dictKey.sysNormalDisable,
    dictKey.sysUserSex,
    dictKey.isAdmin,
  )
  const queryParams = ref<userQueryParam>({
    page_num: 1,
    page_size: 10,
  })
  const modalIcon = ref()
  const open = ref(false)
  const title = ref('')
  const form = ref<userInformation>({})
  const {
    isFetching: isLoading,
    data: dataList,
    execute: getList,
  } = useGet<listType<userInformation>>(
    ApiSysUser.getList,
    queryParams,
    { immediate: true },
  )
  const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
  const { useTableSelectChange } = useTableUtil()
  const { handleSelectionChangeFnX, ids, values, single, selected }
      = useTableSelectChange()

  // 表格列属性
  const columns: TableColumnData[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      ellipsis: true,
      tooltip: true,
      width: 200,
      align: 'center',
    },
    {
      title: t('profile.name'),
      dataIndex: 'user_name',
      align: 'center',
      width: 100,
    },
    {
      title: t('profile.nickName'),
      dataIndex: 'user_nickname',
      align: 'center',
      width: 150,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('user.dept'),
      dataIndex: 'dept.dept_name',
      align: 'center',
      width: 100,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '手机号码',
      dataIndex: 'phone_num',
      align: 'center',
      width: 100,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '状态',
      width: 100,
      align: 'center',
      render: ({ record }) => h(DictTag, {
        options: dicts.value[dictKey.sysNormalDisable],
        value: record.user_status,
      }),
    },
    {
      title: '创建时间',
      width: 180,
      align: 'center',
      render: ({ record }) => parseTime(record.created_at),
    },
    {
      title: '操作',
      slotName: 'operation',
      width: 150,
      fixed: 'right',
      align: 'center',
    },
  ]
  const queryFormItems = ref<IuQueryFormField[]>([
    {
      field: 'user_name',
      label: '用户名称',
      type: FormItemType.input,
      placeholder: '请输入用户名称',
    },
    {
      field: 'phone_num',
      label: '电话号码',
      type: FormItemType.input,
      placeholder: '请输入电话号码',
    },
    {
      field: 'user_status',
      label: '用户状态',
      type: FormItemType.select,
      placeholder: '请输入用户状态',
      selectOption: {
        dataOption: computed(() => dicts.value[dictKey.sysNormalDisable]),
        dataOptionKey: {
          label: 'label',
          value: 'value',
        },
        allowClear: true,
        allowSearch: true,
      },
    },
    {
      field: 'begin_time',
      label: '开始日期',
      type: FormItemType.datePicker,
      placeholder: '请输入开始日期',
    },
    {
      field: 'end_time',
      label: '结束日期',
      type: FormItemType.datePicker,
      placeholder: '请输入结束日期',
    },
  ])

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
        dataOption: computed(() => dicts.value[dictKey.sysUserSex]),
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
        dataOption: deptTree,
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
        dataOption: deptTree,
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
        dataOption: computed(() => dicts.value[dictKey.isAdmin]),
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
        dataOption: computed(() => dicts.value[dictKey.sysNormalDisable]),
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

  const operateButtons = ref<{ [key: string]: any }[]>([
    {
      label: t('common.add'),
      icon: markRaw(IconPlus),
      auth: computed(() => hasPermission(ApiSysDictType.add)),
      disabled: false,
      fn: handleAdd,
      buttonType: 'primary',
      buttonStatus: 'normal',
    },
    {
      label: t('common.edit'),
      icon: markRaw(IconEdit),
      auth: computed(() => hasPermission(ApiSysDictType.edit)),
      disabled: computed(() => !single.value),
      fn: handleUpdate,
      buttonType: 'primary',
      buttonStatus: 'warning',
    },
    {
      label: t('common.delete'),
      icon: markRaw(IconDelete),
      auth: computed(() => hasPermission(ApiSysDictType.delete)),
      disabled: computed(() => !selected.value),
      fn: handleDelete,
      buttonType: 'primary',
      buttonStatus: 'danger',
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
    const user_id = row?.id || ids.value[0]
    const { data, execute } = useGet<userInfo>(ApiSysUser.getById, { user_id })
    await execute()
    form.value = data.value?.user_info as userInformation
    form.value.post_ids = data.value?.post_ids
    form.value.role_ids = data.value?.role_ids
    form.value.dept_ids = data.value?.dept_ids
    title.value = `${t('common.update')}用户:${form.value?.user_name}`
  }

  // 密码重置
  const resetPwd = ref({
    password: '',
  })
  function handleResetPwd(row: userInformation) {
    resetPwd.value.password = ''
    Modal.warning({
      title: '密码重置',
      hideCancel: false,
      titleAlign: 'start',
      content: () => h(ResetPwd, { formValue: resetPwd.value }),
      footer: true,
      draggable: true,
      onOk: async () => {
        const data: resetUserPwd = {
          user_id: row.id!,
          new_passwd: md5(resetPwd.value.password),
        }
        const { data: dataRes, execute } = usePut(ApiSysUser.resetPwd, data)
        await execute()
        if (dataRes.value === ErrorFlag)
          return
        Message.success(`用户 ${row.user_name} 的密码成功重置为 ${resetPwd.value.password}`)
      },
      onCancel() {
        Message.info(`你取消了重置用户 ${row.user_name} 的密码操作！`)
      },
    })
  }

  async function handleDelete(row?: dictType) {
    await useDeleteFn(
      ApiSysDictType.delete,
      'id',
      ids,
      'user_name',
      values,
      'use_ids',
      row,
      getList,
    )
  }
  async function submitForm() {
    if (form.value.dict_type_id !== undefined) {
      const { execute, data } = usePut(ApiSysDictType.edit, form)

      await execute()
      if (data.value === ErrorFlag)
        return
      Message.success(t('commonTip.updateSuccess'))
    }
    else {
      const { execute, data } = usePost(ApiSysDictType.add, form)
      await execute()
      if (data.value === ErrorFlag)
        return
      Message.success(t('commonTip.addSuccess'))
    }
    open.value = false
    await getList()
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

  return {
    open,
    title,
    form,
    modalIcon,
    dicts,
    queryParams,
    isLoading,
    dataList,
    getList,
    queryFormItems,
    modalFormItems,
    columns,
    operateButtons,
    handleSelectionChangeFnX,
    handleDelete,
    handleResetPwd,
    handleAdd,
    handleUpdate,
    submitForm,
    optionsInit,
  }
}
