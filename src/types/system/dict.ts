/* eslint-disable no-unused-vars */
/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-07 17:03:11
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-09 17:39:29
 * @FilePath: \IUI314\src\types\system\dict.ts
 * @Description:
 */

import type { operateInfo, pageData, pageQueryParam } from '@/types/base/apis'

export enum dictKey {
  sysNormalDisable = 'sys_normal_disable',
  db = 'db',
}

/**
 * 字典转化后使用的数据
 */
export interface dictUse {
  label: string
  value: string
  elTagType: string
  elTagClass?: string
  status: string
}

/**
 * 字典类型请求参数
 */
export interface dictTypeQueryParam extends pageQueryParam {
  dict_name?: string
  dict_type?: string
  status?: string
}

/**
 * 字典类型数据
 */
export interface dictType extends operateInfo {
  dict_type_id: string
  dict_name: string
  dict_type: string
  status: string
  remark: string
}
/**
 * 字典列表请请求返回数据
 */
export interface dictTypeList extends pageData {
  list: dictType[]
}

/**
 * 按字典类型获取数据
 */
export interface dictByType {
  dict_type: string
}

/**
 * 字典数据
 */
export interface DictData {
  dict_data_id: string
  dict_sort: number
  dict_label: string
  dict_value: string
  dict_type: string
  css_class?: string
  list_class: string
  is_default: string
  status: string
  create_by: string
  update_by?: string
  remark: string
  created_at: string
  updated_at: string
  deleted_at?: string
}
