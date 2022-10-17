/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-15 22:30:55
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-17 14:00:23
 * @FilePath: \IUI314\src\types\system\role.ts
 * @Description: 角色
 */

import type { operateInfo, pageData, pageQueryParam } from '../base/apis'

export interface role extends operateInfo {
  role_id?: string
  role_name?: string
  role_key?: string
  list_order?: number
  data_scope?: string
  status?: string
  remark?: string
  menu_ids?: string[] //用于更新菜单权限
  dept_ids?: string[] //用于更新数据权限
}

/**
 * 角色列表数据
 */
export interface roleList extends pageData {
  list: role[]
}

export interface roleQueryParam extends pageQueryParam {
  role_name?: string
  role_key?: string
  status?: string
}
