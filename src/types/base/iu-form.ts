import type { Ref } from 'vue'

export interface IuQueryFormField {
  field: string
  label: string
  type: FormItemType
  selectOption?: SelectOption
  placeholder?: string
}
export enum FormItemType {
  input = 'input',
  inputNumber = 'inputNumber',
  radio = 'radio',
  checkbox = 'checkbox',
  select = 'select',
  timePicker = 'timePicker',
  datePicker = 'datePicker',
  dateRangePicker = 'dateRangePicker',
  timeRangePicker = 'timeRangePicker',
}

type dataOptionType = (string | number | boolean | Record<string, any>)[]
export interface SelectOption {
  dataOption: dataOptionType | Ref<dataOptionType>
  dataOptionKey: {
    value: string
    label: string
  }
  allowClear?: boolean
  multiple?: boolean
  maxTagCount?: number
  allowSearch?: boolean
  loading?: boolean
}
