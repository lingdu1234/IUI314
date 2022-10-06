/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-05 19:54:45
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-06 07:15:58
 * @FilePath: \IUI314\src\stores\modules\tab-bar.ts
 * @Description:
 */
import { defineStore } from 'pinia'
import type { RouteLocationNormalized } from 'vue-router'

import { isString } from '@/hooks/util'
import { DEFAULT_ROUTE, DEFAULT_ROUTE_NAME } from '@/router'
import type { TabBarState, TagProps } from '@/types/base/router'

const formatTag = (route: RouteLocationNormalized): TagProps => {
  const { name, meta, fullPath, query } = route
  return {
    title: meta.title || '',
    name: String(name),
    fullPath,
    query,
    no_cache: meta.no_cache,
  }
}

export const useTabBarStore = defineStore('tab-bar', {
  state: (): TabBarState => ({
    cacheTabList: new Set(DEFAULT_ROUTE_NAME),
    tagList: [DEFAULT_ROUTE],
  }),
  persist: {
    paths: ['tagList'],
  },
  getters: {
    getTabList(): TagProps[] {
      return this.tagList
    },
    getCacheList(): string[] {
      return Array.from(this.cacheTabList)
    },
  },

  actions: {
    updateTabList(route: RouteLocationNormalized) {
      this.tagList.push(formatTag(route))
      if (!route.meta.no_cache) {
        this.cacheTabList.add(route.name as string)
      }
    },
    deleteTag(idx: number, tag: TagProps) {
      this.tagList.splice(idx, 1)
      this.cacheTabList.delete(tag.name)
    },
    addCache(name: string) {
      if (isString(name) && name !== '') this.cacheTabList.add(name)
    },
    deleteCache(tag: TagProps) {
      this.cacheTabList.delete(tag.name)
    },
    freshTabList(tags: TagProps[]) {
      this.tagList = tags
      this.cacheTabList.clear()
      // 要先判断ignoreCache
      this.tagList
        .filter((el) => !el.no_cache)
        .map((el) => el.name)
        .forEach((x) => this.cacheTabList.add(x))
    },
    resetTabList() {
      this.tagList = []
      this.cacheTabList.clear()
      //   this.cacheTabList.add()
    },
  },
})
