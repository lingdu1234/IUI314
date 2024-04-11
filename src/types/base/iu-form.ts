import type { FieldRule, SelectOptionData, SelectOptionGroup } from '@arco-design/web-vue'
import type { Ref } from 'vue'
import type { RadioOption } from '@arco-design/web-vue/es/radio/interface'

export interface IuQueryFormField {
  field: string
  label?: string
  type: FormItemType
  selectOption?: SelectOption
  placeholder?: string
  defaultCol?: number
  fullScreenCol?: number
  defaultItemWidth?: number
  fullScreenIsOnlyOne?: boolean
  defaultIsOnlyOne?: boolean
}
export interface IuFormField extends IuQueryFormField {
  rule?: FieldRule[]
  validateTrigger?: 'change' | 'blur' | 'focus' | 'input' | ('change' | 'blur' | 'focus' | 'input')[]
  disabled?: boolean
  inputNumberMode?: 'embed' | 'button'
  textAreaAutoSize?: boolean
  slotName?: string
}

export enum FormItemType {
  slot = 'slot',
  text = 'text',
  input = 'input',
  textarea = 'textarea',
  inputNumber = 'inputNumber',
  radio = 'radio',
  checkbox = 'checkbox',
  checkboxGroup = 'checkboxGroup',
  select = 'select',
  treeSelect = 'treeSelect',
  colorPicker = 'colorPicker',
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
    key?: string
    title?: string
    value?: string
    label?: string
    children?: string
    disabled?: boolean
  }
  defaultValue?: any
  allowClear?: boolean
  multiple?: boolean
  maxTagCount?: number
  allowSearch?: boolean
  loading?: boolean
}

export interface SelectOptionInterface {
  key: string
  label: string
  value: string
  disabled?: boolean
}
