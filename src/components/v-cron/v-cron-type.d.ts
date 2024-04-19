import type { vCronItem, vCronItemLabel } from '@/components/v-cron/v-cron-const'

export interface vCronPropsType {
  title?: string
  okText?: string
  cancelText?: string
  titleAlign?: 'center' | 'start'
  labelWidth?: number
  itemWidth?: number
}

export interface vCronArrayType {
  value: vCronItem
  label: vCronItemLabel
}

export interface vCronData {
  second?: string
  minute?: string
  hour?: string
  day?: string
  month?: string
  week?: string
  year?: string
}

export interface vCronTableData extends vCronData {
  id: string
}

/**
 * 秒，分，小时的cron只类型
 */
export interface vCronSecondValueType {
  every: string
  cycle: {
    from: number
    to: number
  }
  interval: {
    begin: number
    every: number
  }
  fix: string[] | number[]
}
