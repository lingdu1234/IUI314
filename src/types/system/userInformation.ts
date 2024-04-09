import type { pageData, pageQueryParam } from '../base/apis'
import type { dept } from './dept'

export interface userInformation {
  id?: string
  user_name?: string
  user_nickname?: string
  user_password?: string
  user_status?: string
  user_email?: string
  sex?: string
  avatar?: string
  dept_id?: string
  remark?: string
  is_admin?: string
  phone_num?: string
  post_ids?: string[]
  role_ids?: string[]
  dept_ids?: string[]
  role_id?: string
  created_at?: string
  dept?: dept
}

export interface userQueryParam extends pageQueryParam {
  dept_id?: string
  dept_ids?: string[]
  user_name?: string
  phone_num?: string
  user_status?: string
  status?: string
}

export interface userInfo {
  user_info: userInformation
  post_ids: string[]
  role_ids: string[]
  dept_ids: string[]
  dept_id: string
}

export interface userList extends pageData {
  list: userInformation[]
}

export interface resetUserPwd {
  user_id: string
  new_passwd: string
}
