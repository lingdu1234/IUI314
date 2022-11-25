/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-15 22:34:39
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\types\system\operate-log.ts
 * @Description:
 */
import type { operateInfo, pageData, pageQueryParam } from '../base/apis'

export interface operateLog extends operateInfo {
  oper_id?: string
  time_id?: number
  title?: string
  business_type?: string
  method?: string
  request_method?: string
  operator_type?: string
  oper_name?: string
  dept_name?: string
  oper_url?: string
  oper_ip?: string
  oper_location?: string
  oper_param?: string
  path_param?: string
  json_result?: string
  status?: string
  error_msg?: string
  duration?: number
  oper_time?: string
}

export interface loginLogList extends pageData {
  list: operateLog[]
}

export interface operateLogQueryParam extends pageQueryParam {
  title?: string
  oper_name?: string
  operator_type?: string
  status?: string
}
