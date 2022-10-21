/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-15 18:23:23
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-21 10:38:21
 * @FilePath: \IUI314\src\types\system\test_data_scope.ts
 * @Description: dept
 */

import type { operateInfo, pageData, pageQueryParam } from '../base/apis'

export interface testDataScope extends operateInfo {
  id?: string
  data_a?: string
  data_b?: string
  created_by?: string
}

/**
 * 角色列表数据
 */
export interface deptList extends pageData {
  list: testDataScope[]
}

export interface testDataScopeQueryParam extends pageQueryParam {
  id?: string
  data_a?: string
  data_b?: string
  __r__?: string
}
