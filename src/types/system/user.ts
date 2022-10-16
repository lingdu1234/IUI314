import type { pageData, pageQueryParam } from '../base/apis'
import type { dept } from './dept'

/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-15 18:58:44
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-16 13:25:47
 * @FilePath: \IUI314\src\types\system\user.ts
 * @Description:
 */
export interface user {
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
  user_name?: string
  phone_num?: string
  user_status?: string
  status?: string
}

export interface userInfo {
  user_info: user
  post_ids: string[]
  role_ids: string[]
  dept_ids: string[]
  dept_id: string
}

export interface userList extends pageData {
  list: user[]
}

export interface resetUserPwd {
  user_id: string
  new_passwd: string
}
