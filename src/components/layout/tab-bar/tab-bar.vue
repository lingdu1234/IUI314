<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-05 10:37:49
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-07 00:09:27
 * @FilePath: \IUI314\src\components\layout\tab-bar\tab-bar.vue
 * @Description: 
-->
<template>
  <div class="relative tab-bar-container">
    <el-affix ref="affixRef" :offset-top="offsetTop">
      <div class="flex items-center justify-between">
        <div class="m-t-8px m-b-8px flex items-center tab-bar-box-scroll">
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
        <div class="m-t-8px m-r-5px flex items-center justify-end">
          <div class="flex items-center justify-around tag-bar-operation">
            <div>
              <el-icon @click="refesh" :class="isFreshing ? 'is-loading' : ''">
                <RefreshLeft />
              </el-icon>
            </div>
            <el-dropdown
              class="m-r-20px"
              trigger="click"
              @command="actionSelect"
            >
              <el-icon><ArrowDownBold /></el-icon>
              <template #dropdown>
                <TabBarItemDropdown
                  :item-data="currentRoute"
                  :index="findCurrentRouteIndex()"
                />
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </el-affix>
  </div>
</template>

<script lang="ts" setup name="tab-bar">
import { ArrowDownBold, RefreshLeft } from '@element-plus/icons-vue'
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

const { tagList, findCurrentRouteIndex, currentRoute } = useTabBar()
const isFreshing = ref<boolean>(false)

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
  isFreshing.value = true
  const index = findCurrentRouteIndex()
  tabItemRef.value![index].actionSelect('reload')
  setTimeout(() => {
    isFreshing.value = false
  }, 2000)
}
const actionSelect = async (value: any) => {
  const index = findCurrentRouteIndex()
  tabItemRef.value![index].actionSelect(value)
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
    width: calc(100% - var(--tab-bar-operation-width));
    .tags-wrap {
      white-space: nowrap;
    }
  }

  .tag-bar-operation {
    width: var(--tab-bar-operation-width);
  }
}
</style>
