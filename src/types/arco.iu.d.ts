export type IuButtonStatus = 'normal' | 'warning' | 'success' | 'danger'
export interface IuButtonProps {
  /**
   * 按钮文字
   */
  label?: string
  /**
   * 按钮类型
   */
  type?: 'primary' | 'secondary' | 'outline' | 'dashed' | 'text'
  /**
   * 按钮状态
   */
  status?: 'normal' | 'warning' | 'success' | 'danger'
  /**
   * 按钮大小
   */
  size?: 'mini' | 'small' | 'medium' | 'large'
  /**
   * 按钮形状
   */
  shape?: 'square' | 'round' | 'circle'
  /**
   * 按钮是否禁用
   */
  disabled?: boolean
  /**
   * 按钮是否加载中
   */
  loading?: boolean
  /**
   *  按钮时间
   */
  fn?: () => Promise<void>
  /**
   * 按钮授权
   */
  auth?: boolean
  /**
   * 按钮图标
   */
  icon?: Element
}
