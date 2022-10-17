/* eslint-disable no-unused-vars */
/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-09 14:49:24
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-17 17:17:39
 * @FilePath: \IUI314\src\api\apis.ts
 * @Description:
 */

import type {
  ApiSysDbApi,
  ApiSysDept,
  ApiSysDictData,
  ApiSysDictType,
  ApiSysLogin,
  ApiSysLoginLog,
  ApiSysMenu,
  ApiSysOnlineUser,
  ApiSysOperateLog,
  ApiSysPost,
  ApiSysRole,
  ApiSysScheduledTasks,
  ApiSysScheduledTasksLog,
  ApiSysServiceMonitor,
  ApiSysUser,
} from './sysApis'

export type APIS =
  | ApiSysLogin
  | ApiSysUser
  | ApiSysDictType
  | ApiSysDictData
  | ApiSysMenu
  | ApiSysDbApi
  | ApiSysDept
  | ApiSysPost
  | ApiSysRole
  | ApiSysLoginLog
  | ApiSysOperateLog
  | ApiSysOnlineUser
  | ApiSysServiceMonitor
  | ApiSysScheduledTasks
  | ApiSysScheduledTasksLog

export const ErrorFlag = '__________' //错误标志
export * from './sysApis'
