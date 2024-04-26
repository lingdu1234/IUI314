import type { CheckboxOption, Direction, FieldRule, SelectFieldNames, SelectOptionData, SelectOptionGroup, TreeFieldNames, TreeNodeData } from '@arco-design/web-vue'
import type { RadioOption } from '@arco-design/web-vue/es/radio/interface'
import type { MaybeRef } from '@vueuse/core'
import type { Component } from 'vue'

// 基础表单
export interface IuBaseFormField {
  field: string
  type: FormItemType
  label?: string
  tooltip?: string
  defaultItemWidth?: number
  vShow?: MaybeRef<boolean>
}
// 表单col显示控制
export interface IuFormColControl {
  defaultCol?: number
  fullScreenCol?: number
  fullScreenIsOnlyOne?: boolean
  defaultIsOnlyOne?: boolean
}

// 查询表单
export interface IuQueryFormField extends IuBaseFormField {
  select?: selectProps
  input?: inputProps
  inputNumber?: inputNumberProps
  datePicker?: datePickerProps
  treeSelect?: treeSelectProps
  textArea?: textAreaProps
  radioGroup?: radioGroupProps
  checkboxGroup?: checkboxGroupProps
}

//  modal 表单
export interface IuFormField extends IuQueryFormField, IuFormColControl {
  rule?: FieldRule[]
  validateTrigger?: 'change' | 'blur' | 'focus' | 'input' | ('change' | 'blur' | 'focus' | 'input')[]
  slotName?: string
  renderX?: Component
}

// 通用选项
export interface commonProps {
  placeholder?: string
  size?: 'mini' | 'small' | 'medium' | 'large'
  disabled?: MaybeRef<boolean>
}

// input选项
export interface inputProps extends commonProps {
  allowClear?: boolean
  readonly?: boolean
  type?: 'text' | 'password'
}
// 数字输入框选项
export interface inputNumberProps extends commonProps {
  min?: number
  max?: number
  step?: number
  mode?: 'embed' | 'button'
  precision?: number
  defaultValue?: number
  allowClear?: boolean
  readonly?: boolean
}
// 日期选择器
export interface datePickerProps extends commonProps {
  allowClear?: boolean
  readonly?: boolean
  position?: 'top' | 'tl' | 'tr' | 'bottom' | 'bl' | 'br'
}

// select选择器
export interface selectProps extends commonProps {
  multiple?: boolean
  loading?: boolean
  allowClear?: boolean
  allowSearch?: boolean
  allowCreate?: boolean
  maxTagCount?: number
  bordered?: boolean
  limit?: number
  options: MaybeRef<(string | number | boolean | SelectOptionData | SelectOptionGroup)[]>
  formatLabel?: (data: SelectOptionData) => string
  fieldNames?: SelectFieldNames
}

// select选择器
export interface treeSelectProps extends commonProps {
  multiple?: boolean
  loading?: boolean
  allowClear?: boolean
  allowSearch?: boolean
  allowCreate?: boolean
  maxTagCount?: number
  bordered?: boolean
  limit?: number
  data: MaybeRef<TreeNodeData[]>
  fieldNames?: TreeFieldNames
}

// 文本域
export interface textAreaProps extends commonProps {
  allowClear?: boolean
  autoSize?: boolean
}
// 单选框祖
export interface radioGroupProps extends commonProps {
  type?: 'radio' | 'button'
  options: MaybeRef<Array<string | number | RadioOption>>
  direction?: 'horizontal' | 'vertical'
  defaultValue?: string | number | boolean
}

// 复选框祖
export interface checkboxGroupProps extends commonProps {
  type?: 'radio' | 'button'
  options: Array<string | number | CheckboxOption>
  direction?: Direction
  defaultValue?: Array<string | number | boolean>
  max?: number
}

// 表单项类型
export enum FormItemType {
  slot = 'slot',
  render = 'render',
  text = 'text',
  input = 'input',
  textarea = 'textarea',
  inputNumber = 'inputNumber',
  radio = 'radio',
  radioGroup = 'radioGroup',
  checkbox = 'checkbox',
  checkboxGroup = 'checkboxGroup',
  select = 'select',
  treeSelect = 'treeSelect',
  datePicker = 'datePicker',

}
export interface SelectOptionInterface {
  key?: string
  title?: string
  value?: string
  label?: string
  children?: string
  disabled?: boolean
}
