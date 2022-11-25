/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-15 22:34:39
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\types\system\login-log.ts
 * @Description:
 */
import type { operateInfo, pageData, pageQueryParam } from '../base/apis'

export interface loginLog extends operateInfo {
  info_id: string
  login_name: string
  net: string
  ipaddr: string
  login_location: string
  browser: string
  os: string
  device: string
  status: string
  msg: string
  login_time: string
  module: string
}

export interface loginLogList extends pageData {
  list: loginLog[]
}

export interface loginLogQueryParam extends pageQueryParam {
  ip?: string
  user_name?: string
  status?: string
}
