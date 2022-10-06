/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-06 18:40:42
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-06 19:48:22
 * @FilePath: \IUI314\src\components\layout\tab-bar\useTabBar.ts
 * @Description:
 */

import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useTabBarStore } from '@/stores'
import type { TagProps } from '@/types/base/router'
export enum Eaction {
  // eslint-disable-next-line no-unused-vars
  reload = 'reload',
  // eslint-disable-next-line no-unused-vars
  current = 'current',
  // eslint-disable-next-line no-unused-vars
  left = 'left',
  // eslint-disable-next-line no-unused-vars
  right = 'right',
  // eslint-disable-next-line no-unused-vars
  others = 'others',
  // eslint-disable-next-line no-unused-vars
  all = 'all',
}
export const useTabBar = () => {
  const router = useRouter()
  const route = useRoute()
  const tabBarStore = useTabBarStore()

  const goto = (tag: TagProps) => {
    router.push({ ...tag })
  }
  const tagList = computed(() => {
    return tabBarStore.getTabList
  })

  const findCurrentRouteIndex = () => {
    return tagList.value.findIndex((el) => el.fullPath === route.fullPath)
  }

  const currentRoute = tagList.value[findCurrentRouteIndex()]

  return {
    tagList,
    goto,
    findCurrentRouteIndex,
    currentRoute,
  }
}
