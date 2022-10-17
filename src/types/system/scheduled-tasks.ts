/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-15 22:34:39
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-17 21:45:16
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

export interface scheduledTasksList extends pageData {
  list: scheduledTasks[]
}

export interface scheduledTasksQueryParam extends pageQueryParam {
  job_name?: string
  job_group?: string
  status?: string
}
