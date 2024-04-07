import type { TableColumnData } from '@arco-design/web-vue'
import { computed, ref } from 'vue'
import type { IuFormField, IuQueryFormField } from '@/types/base/iu-form'
import { FormItemType } from '@/types/base/iu-form'
import { dictKey } from '@/types/system/dict'
import { parseTime, useDicts } from '@/hooks'

export function useDictType() {
  const dicts = useDicts(dictKey.sysNormalDisable)
  // 表格列属性
  const columns: TableColumnData[] = [
    {
      title: '字典Id',
      dataIndex: 'dict_type_id',
      ellipsis: true,
      tooltip: true,
      width: 200,
      align: 'center',
    },
    {
      title: '字典名称',
      dataIndex: 'dict_name',
      align: 'center',
      width: 100,
    },
    {
      title: '字典类型',
      slotName: 'dict_type',
      align: 'center',
      width: 150,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      width: 100,
      ellipsis: true,
      tooltip: true,
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
      width: 200,
      fixed: 'right',
      align: 'center',
    },
  ]

  const queryFormItems = ref<IuQueryFormField[]>([
    {
      field: 'dict_name',
      label: '字典名称',
      type: FormItemType.input,
      placeholder: '请输入字典名称',
    },
    {
      field: 'dict_type',
      label: '字典类型',
      type: FormItemType.input,
      placeholder: '请输入字典类型',
    },
    {
      field: 'status',
      label: '字典状态',
      type: FormItemType.select,
      placeholder: '请输入字典状态',
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
    },
  ])

  return {
    dicts,
    queryFormItems,
    editFormItems,
    columns,
  }
}
