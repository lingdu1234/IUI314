/* eslint-disable no-unused-vars */
/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-09-30 19:58:32
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-05 22:17:40
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
  title: string
  icon?: string
  activeMenu?: string
  hidden?: boolean
  link?: string
  no_cache?: boolean
}

export enum MenuType {
  C = 'C',
  M = 'M',
}

export interface TagProps {
  title: string
  name: string
  fullPath: string
  query?: any
  no_cache?: boolean
}

export interface TabBarState {
  tagList: TagProps[]
  cacheTabList: Set<string>
}
