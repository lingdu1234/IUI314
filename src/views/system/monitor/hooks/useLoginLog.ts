import type { TableColumnData } from '@arco-design/web-vue'
import { computed, h, ref } from 'vue'
import type { IuQueryFormField } from '@/types/base/iu-form'
import { FormItemType } from '@/types/base/iu-form'
import { dictKey } from '@/types/system/dict'
import { parseTime, useDicts } from '@/hooks'
import DictTag from '@/components/common/dict-tag.vue'

export function useLoginLog() {
  const dicts = useDicts(dictKey.sysCommonStatus)
  // 表格列属性
  const columns: TableColumnData[] = [
    {
      title: '访问编号',
      dataIndex: 'info_id',
      ellipsis: true,
      tooltip: true,
      width: 100,
      align: 'center',
    },
    {
      title: '用户名称',
      dataIndex: 'login_name',
      align: 'center',
      width: 100,
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
      title: '登录状态',
      width: 100,
      align: 'center',
      render: ({ record }) => h(DictTag, {
        options: dicts.value[dictKey.sysCommonStatus],
        value: record.status,
      }),
    },
    {
      title: '访问时间',
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

  return {
    dicts,
    queryFormItems,
    columns,
  }
}
