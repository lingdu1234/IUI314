import type { FieldRule, SelectOptionData, SelectOptionGroup } from '@arco-design/web-vue'
import type { Component, Ref } from 'vue'
import type { RadioOption } from '@arco-design/web-vue/es/radio/interface'
import type { MaybeRef } from '@vueuse/core'

export interface IuQueryFormField {
  field: string
  type: FormItemType
  label?: string
  tooltip?: string
  selectOption?: SelectOption
  placeholder?: string
  defaultCol?: number
  fullScreenCol?: number
  defaultItemWidth?: number
  fullScreenIsOnlyOne?: boolean
  defaultIsOnlyOne?: boolean
  vShow?: boolean | Ref<boolean>
}
export interface IuFormField extends IuQueryFormField {
  rule?: FieldRule[]
  validateTrigger?: 'change' | 'blur' | 'focus' | 'input' | ('change' | 'blur' | 'focus' | 'input')[]
  disabled?: MaybeRef<boolean>
  inputNumberMode?: 'embed' | 'button'
  inputNumberOptions?: inputNumberOptions
  textAreaAutoSize?: boolean
  slotName?: string
  renderX?: Component
}

export interface inputNumberOptions {
  min?: number
  max?: number
  step?: number
  allowClear?: boolean
  precision?: number
  defaultValue?: number
}

export enum FormItemType {
  slot = 'slot',
  render = 'render',
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
    disabled?: string
  }
  defaultValue?: any
  allowClear?: boolean
  multiple?: boolean
  maxTagCount?: number
  allowSearch?: boolean
  allowCreate?: boolean
  loading?: boolean
}

export interface SelectOptionInterface {
  key?: string
  title?: string
  value?: string
  label?: string
  children?: string
  disabled?: boolean
}
