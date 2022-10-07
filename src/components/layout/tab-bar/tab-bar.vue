<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-05 10:37:49
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-07 14:01:45
 * @FilePath: \IUI314\src\components\layout\tab-bar\tab-bar.vue
 * @Description: 
-->
<template>
  <div class="relative w-100% tab-bar-container">
    <div class="flex items-center justify-between">
      <div class="m-t-0px m-b-5px flex items-center tab-bar-box-scroll">
        <el-scrollbar ref="scrollbarRef" @wheel="tabScroll">
          <div class="p-l--5px tags-wrap">
            <tab-item
              ref="tabItemRef"
              v-for="(tag, index) in tagList"
              :key="tag.fullPath"
              :index="index"
              :item-data="tag"
            />
          </div>
        </el-scrollbar>
      </div>
      <TagBarOperation />
    </div>
  </div>
</template>

<script lang="ts" setup name="tab-bar">
import { ElScrollbar } from 'element-plus'
import { onUnmounted, ref } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

import {
  listenerRouteChange,
  listenerTabBarAction,
  removeRouteListener,
  removeTabBarActionListener,
} from '@/hooks'
import { useTabBarStore } from '@/stores'

import tabItem from './tab-item.vue'
import TagBarOperation from './tag-bar-operation.vue'
import { Eaction, useTabBar } from './useTabBar'

const tabBarStore = useTabBarStore()
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()
const tabItemRef = ref<InstanceType<typeof tabItem>[]>()

const { tagList, findCurrentRouteIndex } = useTabBar()

const actionSelect = async (value: any) => {
  const index = findCurrentRouteIndex()
  tabItemRef.value![index].actionSelect(value)
}

const tabScroll = (e: WheelEvent) => {
  const eventDelta = -e.deltaY * 40
  const tab_scroll_position =
    (scrollbarRef.value?.wrap$?.scrollLeft as number) + eventDelta
  scrollbarRef.value!.setScrollLeft(tab_scroll_position)
}

listenerRouteChange((route: RouteLocationNormalized) => {
  if (!tagList.value.some((tag) => tag.fullPath === route.fullPath)) {
    tabBarStore.updateTabList(route)
  }
}, true)

listenerTabBarAction((v: Eaction) => actionSelect(v), true)

onUnmounted(() => {
  removeRouteListener()
  removeTabBarActionListener()
})
</script>

<style scoped lang="scss">
.tab-bar-container {
  background-color: var(--tab-bar-bg-color);
  .tab-bar-box-scroll {
    padding: 1px 0px;
    width: calc(100% - var(--tab-bar-operation-width));
    .tags-wrap {
      white-space: nowrap;
    }
  }
}
</style>