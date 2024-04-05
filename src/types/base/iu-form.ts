import type { FieldRule, SelectOptionData, SelectOptionGroup } from '@arco-design/web-vue'
import type { Ref } from 'vue'
import type { RadioOption } from '@arco-design/web-vue/es/radio/interface'

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

export type dataOptionType = (string | number | boolean | SelectOptionData | SelectOptionGroup | RadioOption)[] | undefined
export type dataOptionTypeRadio = (string | number | RadioOption)[] | undefined
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
