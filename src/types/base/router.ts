/* eslint-disable no-unused-vars */
/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-09-30 19:58:32
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\types\base\router.ts
 * @Description:
 */
import type { defineComponent } from 'vue'

export type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>)

export interface AppRouteRecordRaw {
  path: string
  name?: string | symbol
  component: Component | string
  hidden?: boolean
  meta?: AppRouteMeta
  redirect?: string
  children?: AppRouteRecordRaw[]
  props?: Record<string, any>
  query?: string
  noShowingChildren?: boolean
  always_show?: boolean
  menu_type?: MenuType
  id?: string
  pid?: string
  menu_name?: string
}

export interface AppRouteMeta {
  title: string // 标题显示
  icon?: string // 图标名称
  activeMenu?: string // 激活菜单路径
  hidden?: boolean // 是否隐藏
  link?: string // 外链
  i18n?: string // 国际化标志
  no_cache?: boolean // keep-alive 标志 true时不缓存
}

/**
 * @ C 为菜单，具有路由导航的菜单，曲子CaiDan拼音的第一个字母
 * @ M 为目录，作为路由目录而存在，取自MuLu的第一个字母
 * @ F 为Api级别，取自Function的第一个字母
 */
export enum MenuType {
  C = 'C',
  M = 'M',
  F = 'F',
}

export interface TagProps {
  title: string
  path: string
  name: string
  fullPath: string
  query?: any
  no_cache?: boolean
  i18n?: string
}

export interface TabBarState {
  tagList: TagProps[]
  cacheTabList: Set<string>
}
