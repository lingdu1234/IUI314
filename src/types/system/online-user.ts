/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-15 22:34:39
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-17 21:24:10
 * @FilePath: \IUI314\src\types\system\online-user.ts
 * @Description:
 */
import type { operateInfo, pageData, pageQueryParam } from '../base/apis'

export interface onlineUser extends operateInfo {
  id?: string
  u_id?: string
  token_id?: string
  token_exp?: number
  login_time?: string
  user_name?: string
  dept_name?: string
  net?: string
  ipaddr?: string
  login_location?: string
  device?: string
  browser?: string
  os?: string
}

export interface onlineUserList extends pageData {
  list: onlineUser[]
}

export interface onlineUserQueryParam extends pageQueryParam {
  ipaddr?: string
  user_name?: string
  status?: string
}
