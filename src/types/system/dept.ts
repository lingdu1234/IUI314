/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-15 18:23:23
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-21 08:41:02
 * @FilePath: \IUI314\src\types\system\dept.ts
 * @Description: dept
 */

import type { pageData, pageQueryParam } from '../base/apis'

export interface dept {
  dept_id?: string
  parent_id?: string
  dept_name?: string
  order_num?: number
  leader?: string
  phone?: string
  email?: string
  status?: string
  create_at?: string
  children?: dept[]
}

/**
 * 角色列表数据
 */
export interface deptList extends pageData {
  list: dept[]
}

export interface deptQueryParam extends pageQueryParam {
  dept_name?: string
  status?: string
}
