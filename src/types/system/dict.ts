/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-07 17:03:11
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\types\system\dict.ts
 * @Description:dict type define
 */

import type { operateInfo, pageData, pageQueryParam } from '@/types/base/apis'

export enum dictKey {
  sysNormalDisable = 'sys_normal_disable',
  db = 'db',
  sysApiMethod = 'sys_api_method',
  apiCacheMethod = 'api_cache_method',
  apiLogMethod = 'api_log_method',
  sysShowHide = 'sys_show_hide',
  isAdmin = 'is_admin',
  sysUserSex = 'sys_user_sex',
  sysOperType = 'sys_oper_type',
  sysCommonStatus = 'sys_common_status',
  sysJobGroup = 'sys_job_group',
  sysJobStatus = 'sys_job_status',
  sysTaskIsOnce = 'sys_task_is_once',
}

/**
 * 字典转化后使用的数据
 */
export interface dictUse {
  label: string
  value: string
  elTagType?:
    | ''
    | 'success'
    | 'warning'
    | 'info'
    | 'danger'
    | 'primary'
    | 'default'
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
 * 字典数据请求参数
 */
export interface dictDataQueryParam extends pageQueryParam {
  dict_label?: string
  dict_type?: string
  status?: string
}

/**
 * 字典类型数据
 */
export interface dictType extends operateInfo {
  dict_type_id?: string
  dict_name: string
  dict_type: string
  status: string
  remark: string
}

/**
 * 字典数据
 */
export interface dictData extends operateInfo {
  dict_data_id?: string
  dict_sort?: number
  dict_label?: string
  dict_value?: string
  dict_type?: string
  css_class?: string
  list_class?: 'red' | 'orangered' | 'orange' | 'gold' | 'lime' | 'green' | 'cyan' | 'blue' | 'arcoblue' | 'purple' | 'pinkpurple' | 'magenta' | 'gray'
  is_default?: string
  status?: string
  remark?: string
}

/**
 * 字典列表请请求返回数据
 */
export interface dictTypeList extends pageData {
  list: dictType[]
}

/**
 * 字典列表请请求返回数据
 */
export interface dictDataList extends pageData {
  list: dictData[]
}

/**
 * 按字典类型获取数据
 */
export interface dictByType {
  dict_type: string
}
