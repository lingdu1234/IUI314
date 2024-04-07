import { Message, Modal, type TableColumnData } from '@arco-design/web-vue'
import { computed, h, markRaw, ref } from 'vue'
import { IconDelete, IconEdit, IconPlus } from '@arco-design/web-vue/es/icon'
import { useI18n } from 'vue-i18n'
import md5 from 'blueimp-md5'
import type { IuFormField, IuQueryFormField } from '@/types/base/iu-form'
import { FormItemType } from '@/types/base/iu-form'
import { dictKey, type dictType } from '@/types/system/dict'
import { hasPermission, type listType, parseTime, useDeleteFn, useDicts, useGet, usePut, useTableUtil } from '@/hooks'
import { ApiSysDictType, ApiSysUser } from '@/api/sysApis'
import type { MessageSchema } from '@/i18n'
import DictTag from '@/components/common/dict-tag.vue'
import type { resetUserPwd, userInformation, userQueryParam } from '@/types/system/userInformation'
import ResetPwd from '@/views/system/auth/pages/resetPwd.vue'
import { ErrorFlag } from '@/api/apis'

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
  const form = ref<dictType>({
    dict_name: '',
    dict_type: '',
    dict_type_id: undefined,
    remark: '',
    status: '1',
  })
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

  const editFormItems = ref<IuFormField[]>([
    {
      field: 'dict_name',
      label: '字典名称',
      type: FormItemType.input,
      placeholder: '请输入字典名称',
      rule: [
        { required: true, message: '字典名称不能为空' },
        { type: 'string', minLength: 2, maxLength: 20, message: '字典名称2~20个字符' },
      ],
      validateTrigger: 'blur',
    },
    {
      field: 'dict_type',
      label: '字典类型',
      type: FormItemType.input,
      placeholder: '请输入字典类型',
      rule: [
        { required: true, message: '字典类型不能为空' },
        { type: 'string', minLength: 2, maxLength: 20, message: '字典类型2~20个字符' },
      ],
      validateTrigger: 'blur',
    },
    {
      field: 'status',
      label: '字典状态',
      type: FormItemType.radio,
      placeholder: '请输入字典状态',
      selectOption: {
        dataOption: computed(() => dicts.value[dictKey.sysNormalDisable]),
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
      fullScreenCol: 2,
      fullScreenIsOnlyOne: true,
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
    console.log('handleAdd')
  }
  function handleUpdate() {
    console.log('handleAdd')
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

  return {
    dicts,
    queryParams,
    isLoading,
    dataList,
    getList,
    queryFormItems,
    editFormItems,
    columns,
    operateButtons,
    handleSelectionChangeFnX,
    handleDelete,
    handleResetPwd,
  }
}
