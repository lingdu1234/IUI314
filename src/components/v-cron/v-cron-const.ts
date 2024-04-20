import type { TableColumnData } from '@arco-design/web-vue'
import type { vCronArrayType } from '@/components/v-cron/v-cron-type'

export enum vCronItem {
  second = 'second',
  minute = 'minute',
  hour = 'hour',
  day = 'day',
  month = 'month',
  week = 'week',
  year = 'year',
}
export enum vCronItemLabel {
  second = '秒',
  minute = '分',
  hour = '时',
  day = '天',
  month = '月',
  week = '周',
  year = '年',
}

// 选项分组
export enum vCronGroup {
  every = 'every',
  cycle = 'cycle',
  interval = 'interval',
  fix = 'fix',
}

export const cronArrayX: vCronArrayType[] = [
  {
    label: vCronItemLabel.second,
    value: vCronItem.second,
  },
  {
    label: vCronItemLabel.minute,
    value: vCronItem.minute,
  },
  {
    label: vCronItemLabel.hour,
    value: vCronItem.hour,
  },
  {
    label: vCronItemLabel.day,
    value: vCronItem.day,
  },
  {
    label: vCronItemLabel.month,
    value: vCronItem.month,
  },
  {
    label: vCronItemLabel.week,
    value: vCronItem.week,
  },
  {
    label: vCronItemLabel.year,
    value: vCronItem.year,
  },
]

export const vCronTableWidth = 100

export const vCronTableColumn: TableColumnData[] = [
  {
    title: '#',
    dataIndex: 'id',
    align: 'center',
    width: vCronTableWidth,
  },
  {
    title: vCronItemLabel.second,
    dataIndex: vCronItem.second,
    width: vCronTableWidth,
    ellipsis: true,
    tooltip: true,
    align: 'center',
  },
  {
    title: vCronItemLabel.minute,
    dataIndex: vCronItem.minute,
    width: vCronTableWidth,
    ellipsis: true,
    tooltip: true,
    align: 'center',
  },
  {
    title: vCronItemLabel.hour,
    dataIndex: vCronItem.hour,
    width: vCronTableWidth,
    ellipsis: true,
    tooltip: true,
    align: 'center',
  },
  {
    title: vCronItemLabel.day,
    dataIndex: vCronItem.day,
    width: vCronTableWidth,
    ellipsis: true,
    tooltip: true,
    align: 'center',
  },
  {
    title: vCronItemLabel.month,
    dataIndex: vCronItem.month,
    width: vCronTableWidth,
    ellipsis: true,
    tooltip: true,
    align: 'center',
  },
  {
    title: vCronItemLabel.week,
    dataIndex: vCronItem.week,
    width: vCronTableWidth,
    ellipsis: true,
    tooltip: true,
    align: 'center',
  },
  {
    title: vCronItemLabel.year,
    dataIndex: vCronItem.year,
    width: vCronTableWidth,
    ellipsis: true,
    tooltip: true,
    align: 'center',
  },
]
export const weekList = [
  '星期日',
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
]
// 使用1代表周天，2-6为周一到周六，这个可能存在差异
export const weekArray = [
  {
    label: '星期日',
    value: 1,
  },
  {
    label: '星期一',
    value: 2,
  },
  {
    label: '星期二',
    value: 3,
  },
  {
    label: '星期三',
    value: 4,
  },
  {
    label: '星期四',
    value: 5,
  },
  {
    label: '星期五',
    value: 6,
  },
  {
    label: '星期六',
    value: 7,
  },
]
