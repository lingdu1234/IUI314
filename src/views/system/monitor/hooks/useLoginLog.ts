import type { TableColumnData } from '@arco-design/web-vue'
import { computed, ref } from 'vue'
import type { IuFormField, IuQueryFormField } from '@/types/base/iu-form'
import { FormItemType } from '@/types/base/iu-form'
import { dictKey } from '@/types/system/dict'
import { useDicts } from '@/hooks'

export function useLoginLog() {
  const dicts = useDicts(dictKey.sysCommonStatus)
  // 表格列属性
  const columns: TableColumnData[] = [
    {
      title: '访问编号',
      dataIndex: 'info_id',
      ellipsis: true,
      tooltip: true,
      width: 200,
      align: 'center',
    },
    {
      title: '用户名称',
      dataIndex: 'login_name',
      align: 'center',
      width: 120,
    },
    {
      title: '网络',
      dataIndex: 'net',
      align: 'center',
      width: 150,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '地址',
      dataIndex: 'ipaddr',
      align: 'center',
      width: 120,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '登录地点',
      dataIndex: 'login_location',
      width: 180,
      align: 'center',
    },
    {
      title: '操作系统',
      dataIndex: 'os',
      width: 180,
      align: 'center',
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
      width: 180,
      align: 'center',
    },
    {
      title: '设备',
      dataIndex: 'device',
      width: 180,
      align: 'center',
    },
    {
      title: '登录状态',
      slotName: 'status',
      width: 100,
      align: 'center',
    },
    {
      title: '访问时间',
      slotName: 'loginTime',
      width: 180,
      align: 'center',
    },
    {
      title: '操作',
      slotName: 'operation',
      width: 200,
      fixed: 'right',
      align: 'center',
    },
  ]

  const queryFormItems = ref<IuQueryFormField[]>([
    {
      field: 'ip',
      label: '登录 IP',
      type: FormItemType.input,
      placeholder: '请输入登录IP',
    },
    {
      field: 'user_name',
      label: '登录名称',
      type: FormItemType.input,
      placeholder: '请输入登录名称',
    },
    {
      field: 'status',
      label: '登录状态',
      type: FormItemType.select,
      placeholder: '请输入登录状态',
      selectOption: {
        dataOption: computed(() => dicts.value[dictKey.sysCommonStatus]),
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
        { type: 'string', minLength: 2, maxLength: 10, message: '字典名称2~10个字符' },
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
        { type: 'string', minLength: 2, maxLength: 10, message: '字典类型2~10个字符' },
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
    },
  ])

  return {
    dicts,
    queryFormItems,
    editFormItems,
    columns,
  }
}
