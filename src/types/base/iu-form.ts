import type { Ref } from 'vue'
import type { FieldRule } from '@arco-design/web-vue'

export interface IuQueryFormField {
  field: string
  label: string
  type: FormItemType
  selectOption?: SelectOption
  placeholder?: string
}
export interface IuFormField extends IuQueryFormField {
  rule?: FieldRule[]
  validateTrigger?: 'change' | 'input' | 'focus' | 'blur'
  disabled?: boolean
  inputNumberMode?: 'embed' | 'button'
}

export enum FormItemType {
  input = 'input',
  textarea = 'textarea',
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
