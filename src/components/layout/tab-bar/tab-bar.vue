<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-05 10:37:49
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-11-04 20:28:37
 * @FilePath: \IUI314\src\components\layout\tab-bar\tab-bar.vue
 * @Description: 
-->
<template>
  <div class="relative w-100% tab-bar-container">
    <div class="flex items-center justify-between">
      <div class="m-t-0px m-b-5px flex items-center tab-bar-box-scroll">
        <el-scrollbar ref="scrollbarRef" @wheel="tabScroll">
          <div class="p-l--5px tags-wrap">
            <TabItem
              v-for="(tag, index) in tagList"
              :key="tag.fullPath"
              ref="tabItemRef"
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

<script lang="ts" name="tab-bar" setup>
import { ElScrollbar } from 'element-plus'
import { nextTick, onUnmounted, ref, watch } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

import TabItem from '@/components/layout/tab-bar/tab-item.vue'
import {
  listenerRouteChange,
  listenerTabBarAction,
  removeRouteListener,
  removeTabBarActionListener,
} from '@/hooks'
import { usePermissionStore, useTabBarStore } from '@/stores'

import type tabItem from './tab-item.vue'
import TagBarOperation from './tag-bar-operation.vue'
import { Eaction, useTabBar } from './useTabBar'

const tabBarStore = useTabBarStore()
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()
const tabItemRef = ref<InstanceType<typeof tabItem>[]>()

const { tagList, findCurrentRouteIndex } = useTabBar()
const permissionStore = usePermissionStore()

watch(
  () => [tagList.value, permissionStore.routeIsDone],
  () => {
    // 只能设置一个变量来监控路由加载完成后再操作
    if (permissionStore.routeIsDone) {
      nextTick(() => {
        moveToTarget()
      })
    }
  },
  {
    deep: true,
  }
)

const actionSelect = async (value: Eaction) => {
  const index = findCurrentRouteIndex()
  tabItemRef.value![index].actionSelect(value)
}

const tabScroll = (e: WheelEvent) => {
  const eventDelta = -e.deltaY * 40
  const tab_scroll_position =
    (scrollbarRef.value?.wrap$?.scrollLeft as number) + eventDelta
  scrollbarRef.value!.setScrollLeft(tab_scroll_position)
}

const moveToTarget = () => {
  const index = findCurrentRouteIndex()
  const barWidth = scrollbarRef.value?.$el.offsetWidth as number
  const scrollWidth = scrollbarRef.value?.wrap$?.scrollWidth!
  // 如果滚动的内容款到大于容器宽度
  if (scrollWidth > barWidth) {
    const tabBarLength = tagList.value.length
    // 如果是最后一个标签
    if (index === tabBarLength - 1) {
      const position = scrollWidth - barWidth
      scrollbarRef.value!.setScrollLeft(position)
      return
    }
    const left = tabItemRef.value![index].$el.offsetLeft as number
    const position = left - barWidth / 2
    scrollbarRef.value!.setScrollLeft(position)
  }
}

listenerRouteChange((route: RouteLocationNormalized) => {
  for (let index = 0; index < tagList.value.length; index++) {
    const element = tagList.value[index]
    if (element.path === route.path) {
      tabBarStore.setTabList(route, index)
      return
    }
    if (index === tagList.value.length - 1) {
      tabBarStore.updateTabList(route)
      return
    }
  }
}, true)

listenerTabBarAction((v: Eaction) => actionSelect(v), true)

onUnmounted(() => {
  removeRouteListener()
  removeTabBarActionListener()
})
</script>

<style lang="scss" scoped>
.tab-bar-container {
  background-color: var(--tab-bar-bg-color);

  .tab-bar-box-scroll {
    padding: 1px 0;
    width: calc(100% - var(--tab-bar-operation-width));

    .tags-wrap {
      white-space: nowrap;
    }
  }
}
</style>
