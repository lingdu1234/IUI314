import type { TableColumnData } from '@arco-design/web-vue'
import { computed, h, ref } from 'vue'
import type { IuFormField, IuQueryFormField } from '@/types/base/iu-form'
import { FormItemType } from '@/types/base/iu-form'
import { dictKey } from '@/types/system/dict'
import { parseTime, useDicts } from '@/hooks'
import DictTag from '@/components/common/dict-tag.vue'

export function useOperateLog() {
  const dicts = useDicts(
    dictKey.sysCommonStatus,
    dictKey.sysApiMethod,
    dictKey.sysOperType,
  )
  // 表格列属性
  const columns: TableColumnData[] = [
    {
      title: '日志编号',
      dataIndex: 'oper_id',
      ellipsis: true,
      tooltip: true,
      width: 100,
      align: 'center',
    },
    {
      title: '系统模块',
      dataIndex: 'title',
      ellipsis: true,
      tooltip: true,
      align: 'center',
      width: 150,
    },
    {
      title: '操作类型',
      align: 'center',
      width: 100,
      render: ({ record }) => h(DictTag, {
        options: dicts.value[dictKey.sysOperType],
        value: record.operator_type,
      }),
    },
    {
      title: '请求方式',
      align: 'center',
      width: 100,
      render: ({ record }) => h(DictTag, {
        options: dicts.value[dictKey.sysApiMethod],
        value: record.request_method,
      }),
    },
    {
      title: '操作人员',
      dataIndex: 'oper_name',
      align: 'center',
      width: 120,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '地址',
      dataIndex: 'oper_location',
      ellipsis: true,
      tooltip: true,
      width: 180,
      align: 'center',
    },
    {
      title: '操作状态',
      align: 'center',
      width: 100,
      render: ({ record }) => h(DictTag, {
        options: dicts.value[dictKey.sysCommonStatus],
        value: record.status,
      }),
    },
    {
      title: '耗时(μs)',
      dataIndex: 'duration',
      width: 180,
      align: 'center',
    },
    {
      title: '操作时间',
      width: 180,
      align: 'center',
      render: ({ record }) => parseTime(record.oper_time),
    },
    {
      title: '操作',
      slotName: 'operation',
      width: 100,
      fixed: 'right',
      align: 'center',
    },
  ]

  const queryFormItems = ref<IuQueryFormField[]>([
    {
      field: 'title',
      label: '系统模块',
      type: FormItemType.input,
      placeholder: '请输入系统模块',
    },
    {
      field: 'oper_name',
      label: '操作人员',
      type: FormItemType.input,
      placeholder: '请输入操作人员',
    },
    {
      field: 'operator_type',
      label: '操作类型',
      type: FormItemType.input,
      placeholder: '请输入操作类型',
    },
    {
      field: 'status',
      label: '操作状态',
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
      field: 'title',
      label: '操作模块',
      type: FormItemType.text,
    },
    {
      field: 'request_method',
      label: '请求方式',
      type: FormItemType.text,
    },
    {
      field: 'oper_name',
      label: '操作人',
      type: FormItemType.text,
    },
    {
      field: 'oper_ip',
      label: '操作IP',
      type: FormItemType.text,
    },
    {
      field: 'oper_location',
      label: '操作地址',
      type: FormItemType.text,
    },
    {
      field: 'oper_url',
      label: '请求地址',
      type: FormItemType.text,
    },
    {
      field: 'method',
      label: '操作方法',
      type: FormItemType.text,
    },
    {
      field: 'oper_param',
      label: '请求参数',
      type: FormItemType.text,
    },
    {
      field: 'path_param',
      label: '路径参数',
      type: FormItemType.text,
    },
    {
      field: 'duration',
      label: '耗时(μs)',
      type: FormItemType.text,
    },
    {
      field: 'status',
      label: '操作状态',
      type: FormItemType.text,
    },
    {
      field: 'oper_time',
      label: '操作时间',
      type: FormItemType.text,
    },
    {
      field: 'error_msg',
      label: '异常信息',
      type: FormItemType.text,
    },
    {
      field: 'json_result',
      label: '返回结果',
      type: FormItemType.text,
      textAreaAutoSize: true,
    },
  ])

  return {
    dicts,
    editFormItems,
    queryFormItems,
    columns,
  }
}
