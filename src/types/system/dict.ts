/* eslint-disable no-unused-vars */
/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-07 17:03:11
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-08 18:48:26
 * @FilePath: \IUI314\src\types\system\dict.ts
 * @Description:
 */

export enum dictKey {
  sysNormalDisable = 'sys_normal_disable',
  db = 'db',
}

// 转化后使用的数据
export interface DictUse {
  label: string
  value: string
  elTagType: string
  status: string
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
