/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-12 18:15:58
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\types\system\menu.ts
 * @Description: menu type define
 */
import type { operateInfo, pageData, pageQueryParam } from '@/types/base/apis'

import type { MenuType } from '../base/router'

/**
 * 菜单数据请求参数
 */
export interface menuQueryParam extends pageQueryParam {
  menu_name?: string
  menu_type?: MenuType
  menu_types?: string
  method?: string
  status?: string
}
/**
 * 菜单数据
 */
export interface menu extends operateInfo {
  id?: string
  pid?: string
  path?: string
  menu_name?: string
  icon?: string
  menu_type?: string
  query?: string
  order_sort?: number
  status?: string
  api?: string
  method?: string
  component?: string
  visible?: string
  is_cache?: string
  log_method?: string
  data_cache_method?: string
  is_frame?: string
  data_scope?: string
  remark?: string
  children?: menu[]
  hasChildren?: boolean
  disabled?: boolean
  i18n?: string
}

/**
 * 查询授权目录菜单
 */
export interface authMenu extends menu {
  apis?: string[]
  dbs?: string[]
}
/**
 * 菜单列表数据
 */
export interface menuList extends pageData {
  list: menu[]
}
