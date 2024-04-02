/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-05 19:54:45
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\stores\modules\tab-bar.ts
 * @Description:
 */
import { defineStore } from 'pinia'
import type { RouteLocationNormalized } from 'vue-router'

import { isString } from '@/hooks'
import { DEFAULT_ROUTE, DEFAULT_ROUTE_NAME, router } from '@/router'
import type { TabBarState, TagProps } from '@/types/base/router'
import { TabAction } from '@/components/layout/tab-bar/useTabBar'

export function formatTag(route: RouteLocationNormalized): TagProps {
  const { name, meta, fullPath, query, path } = route
  return {
    title: meta.title || '',
    name: String(name),
    fullPath,
    path,
    query,
    no_cache: meta.no_cache,
    i18n: meta.i18n,
  }
}

export const useTabBarStore = defineStore('tab-bar', {
  state: (): TabBarState => ({
    cacheTabList: new Set(),
    tagList: [DEFAULT_ROUTE],
    currentRoute: undefined,
  }),

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
      if (route.fullPath.includes('redirect'))
        return
      this.tagList.push(formatTag(route))
      if (route.meta.no_cache === false)
        this.cacheTabList.add(route.name as string)
    },
    setTabList(route: RouteLocationNormalized, index: number) {
      if (route.fullPath.includes('redirect'))
        return
      this.tagList[index] = formatTag(route)
      if (route.meta.no_cache === false)
        this.cacheTabList.add(route.name as string)
    },
    deleteTag(idx: number, tag: TagProps) {
      this.tagList.splice(idx, 1)
      this.cacheTabList.delete(tag.name)
    },
    addCache(tag: TagProps) {
      const { name, no_cache } = tag
      if (!no_cache && isString(name) && name !== '')
        this.cacheTabList.add(name)
    },
    deleteCache(tag: TagProps) {
      this.cacheTabList.delete(tag.name)
    },
    freshTabList(tags: TagProps[]) {
      this.tagList = tags
      this.cacheTabList.clear()
      // 要先判断ignoreCache
      this.tagList
        .filter(el => !el.no_cache)
        .map(el => el.name)
        .forEach(x => this.cacheTabList.add(x))
    },
    resetTabList() {
      this.tagList = [DEFAULT_ROUTE]
      this.cacheTabList.clear()
    },
    setCurrentRoute(route: RouteLocationNormalized) {
      this.currentRoute = route
    },
    getTabIndex(tag: TagProps) {
      return this.tagList.findIndex(el => el.fullPath === tag.fullPath)
    },
    getCurrentRouteIndex() {
      return this.tagList.findIndex(el => el.fullPath === this.currentRoute?.fullPath)
    },
    async tagClose(tag: TagProps) {
      const index = this.getTabIndex(tag)
      this.deleteTag(index, tag)
      if (tag.fullPath === this.currentRoute?.fullPath) {
        const latest = this.tagList[index - 1] // 获取队列的前一个tab
        if (latest && latest.name) {
          await router.push({ name: latest.name })
        }
        else {
          this.resetTabList()
          await router.push({ name: DEFAULT_ROUTE_NAME })
        }
      }
    },
    async  tabActionSelect(itemData: TagProps, value: TabAction) {
      const index = this.getTabIndex(itemData)
      const currentRouteIdx = this.getCurrentRouteIndex()
      const copyTagList = [...this.tagList]
      switch (value) {
        case TabAction.current:
          await this.tagClose(itemData)
          break
        case TabAction.left:
          copyTagList.splice(1, index - 1)

          this.freshTabList(copyTagList)
          if (currentRouteIdx < index)
            await router.push({ name: itemData.name })
          break
        case TabAction.right:
          copyTagList.splice(index + 1)

          this.freshTabList(copyTagList)
          if (currentRouteIdx > index)
            await router.push({ name: itemData.name })
          break
        case TabAction.others:
        {
          const filterList = this.tagList.filter((_el, idx) => {
            return idx === index
          })
          this.freshTabList(filterList)
          await router.push({ name: itemData.name })
          break
        }
        case TabAction.reload:
          await this.reload(itemData)
          break
        case TabAction.all:
          this.resetTabList()
          await router.push({ name: DEFAULT_ROUTE_NAME })
      }
    },
    async reload(tag: TagProps) {
      this.deleteCache(tag)
      await router.replace({
        path: `/redirect${tag.fullPath}`,
        query: tag.query,
      })
      this.addCache(tag)
    },
  },
})
