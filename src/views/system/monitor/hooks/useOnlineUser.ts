import type { TableColumnData } from '@arco-design/web-vue'
import { ref } from 'vue'
import type { IuQueryFormField } from '@/types/base/iu-form'
import { FormItemType } from '@/types/base/iu-form'
import { dictKey } from '@/types/system/dict'
import { parseTime, useDicts } from '@/hooks'

export function useOnlineUser() {
  const dicts = useDicts(dictKey.sysCommonStatus)
  // 表格列属性
  const columns: TableColumnData[] = [
    {
      title: '#',
      width: 30,
      align: 'center',
      render: ({ rowIndex }) => rowIndex + 1,
    },
    {
      title: '会话编号',
      dataIndex: 'id',
      align: 'center',
      width: 100,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '所属部门',
      dataIndex: 'dept_name',
      align: 'center',
      width: 100,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '网络',
      dataIndex: 'net',
      align: 'center',
      width: 100,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: 'IP',
      dataIndex: 'ipaddr',
      align: 'center',
      width: 120,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '登录地点',
      dataIndex: 'login_location',
      ellipsis: true,
      tooltip: true,
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
      ellipsis: true,
      tooltip: true,
      width: 120,
      align: 'center',
    },
    {
      title: '设备',
      dataIndex: 'device',
      width: 120,
      ellipsis: true,
      tooltip: true,
      align: 'center',
    },
    {
      title: '登录时间',
      width: 180,
      align: 'center',
      render: ({ record }) => parseTime(record.login_time),
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
      field: 'ipaddr',
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

  return {
    dicts,
    queryFormItems,
    columns,
  }
}
