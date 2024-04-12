import type { Component } from 'vue'
import type { ButtonTypes } from '@arco-design/web-vue/es/button/constants'
import type { IuButtonStatus } from '@/types/arco.iu'
import type { IuFormField } from '@/types/base/iu-form'

export interface iuButtonPropsType {
  icon?: string | Component
  label?: string
  shape?: 'square' | 'round' | 'circle'
  size?: 'mini' | 'small' | 'medium' | 'large'
  auth?: boolean
  disabled?: boolean
  loading?: boolean
  type?: ButtonTypes
  status?: IuButtonStatus
  fn?: () => void
}

export interface iuModalPropsType {
  formItems: IuFormField[]
  icon?: string | Component
  title?: string
  okText?: string
  cancelText?: string
  titleAlign?: 'center' | 'start'
  labelWidth?: number
  itemWidth?: number
  defaultCol?: number
  fullScreenCol?: number
}
