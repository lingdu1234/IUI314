/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-15 22:34:39
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-18 15:21:55
 * @FilePath: \IUI314\src\types\system\scheduled-tasks.ts
 * @Description:
 */
import type { operateInfo, pageData, pageQueryParam } from '../base/apis'

export interface scheduledTasks extends operateInfo {
  job_id?: string
  task_id?: number
  task_count?: number
  run_count?: number
  job_name?: string
  job_params?: any
  job_group?: string
  invoke_target?: string
  cron_expression?: string
  misfire_policy?: string
  concurrent?: string
  status?: string
  remark?: string
  last_time?: string
  next_time?: string
  end_time?: string
}
export interface scheduledTasksLog extends operateInfo {
  job_log_id?: string
  job_id?: string
  lot_id?: number
  lot_order?: number
  job_name?: string
  job_group?: string
  invoke_target?: string
  job_params?: string
  job_message?: string
  status?: string
  exception_info?: any
  is_once?: string
  elapsed_time?: number
}

export interface scheduledTasksList extends pageData {
  list: scheduledTasks[]
}
export interface scheduledTasksLogList extends pageData {
  list: scheduledTasksLog[]
}

export interface scheduledTasksQueryParam extends pageQueryParam {
  job_name?: string
  job_group?: string
  status?: string
}
export interface scheduledTasksLogQueryParam extends pageQueryParam {
  job_id?: string
  job_name?: string
  job_group?: string
  status?: string
  is_once?: string
}
