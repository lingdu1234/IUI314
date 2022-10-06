<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-05 10:37:49
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-06 19:22:26
 * @FilePath: \IUI314\src\components\layout\tab-bar\tab-bar.vue
 * @Description: 
-->
<template>
  <div class="relative tab-bar-container">
    <el-affix ref="affixRef" :offset-top="offsetTop">
      <div class="flex items-center justify-between">
        <div class="flex items-center w-100% tab-bar-box-scroll">
          <el-scrollbar ref="scrollbarRef" @wheel="tabScroll">
            <div class="p-l-4px tags-wrap">
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
        <div class="flex items-center justify-end m-r-5px">
          <el-icon @click="refesh"><Refresh /></el-icon>
          <el-icon><Refresh /></el-icon>
          <el-icon><Refresh /></el-icon>
        </div>
      </div>
    </el-affix>
  </div>
</template>

<script lang="ts" setup name="tab-bar">
import { Refresh } from '@element-plus/icons-vue'
import { ElScrollbar } from 'element-plus'
import { computed, onUnmounted, ref, watch } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

import { listenerRouteChange, removeRouteListener } from '@/hooks/routes'
import { useAppStore, useTabBarStore } from '@/stores'

import tabItem from './tab-item.vue'
import { useTabBar } from './useTabBar'

const appStore = useAppStore()
const tabBarStore = useTabBarStore()
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()
const tabItemRef = ref<InstanceType<typeof tabItem>[]>()

const { tagList, findCurrentRouteIndex } = useTabBar()

const affixRef = ref()
const offsetTop = computed(() => {
  return appStore.app.navBar ? 60 : 0
})

watch(
  () => appStore.app.navBar,
  () => {
    affixRef.value.updatePosition()
  }
)

const refesh = () => {
  const index = findCurrentRouteIndex()

  tabItemRef.value![index].actionSelect('reload')
}

const tabScroll = (e: WheelEvent) => {
  console.log(e)
  const eventDelta = -e.deltaY * 40
  const tab_scroll_position =
    (scrollbarRef.value?.wrap$?.scrollLeft as number) + eventDelta
  scrollbarRef.value!.setScrollLeft(tab_scroll_position)
}

listenerRouteChange((route: RouteLocationNormalized) => {
  if (
    !route.meta.noAffix &&
    !tagList.value.some((tag) => tag.fullPath === route.fullPath)
  ) {
    tabBarStore.updateTabList(route)
  }
}, true)

onUnmounted(() => {
  removeRouteListener()
})
</script>

<style scoped lang="scss">
.tab-bar-container {
  background-color: var(--tab-bar-bg-color);
  .tab-bar-box-scroll {
    padding: 1px 5px;
    .tags-wrap {
      white-space: nowrap;
    }
  }

  .tag-bar-operation {
    display: flex;
    width: 100px;
    height: 32px;
    align-items: center;
  }
}
</style>
