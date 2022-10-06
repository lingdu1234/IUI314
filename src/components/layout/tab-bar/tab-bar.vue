<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-05 10:37:49
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-06 10:11:29
 * @FilePath: \IUI314\src\components\layout\tab-bar\tab-bar.vue
 * @Description: 
-->
<template>
  <div class="tab-bar-container">
    <el-affix ref="affixRef" :offset-top="offsetTop">
      <div class="tab-bar-box">
        <el-scrollbar ref="scrollbarRef" @wheel="tabScroll">
          <div class="tags-wrap">
            <tab-item
              v-for="(tag, index) in tagList"
              :key="tag.fullPath"
              :index="index"
              :item-data="tag"
            />
          </div>
        </el-scrollbar>
        <!-- <div class="tag-bar-operation"></div> -->
      </div>
    </el-affix>
  </div>
</template>

<script lang="ts" setup name="tab-bar">
import { ElScrollbar } from 'element-plus'
import { computed, onUnmounted, ref, watch } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

import { listenerRouteChange, removeRouteListener } from '@/hooks/routes'
import { useAppStore, useTabBarStore } from '@/stores'

import tabItem from './tab-item.vue'

const appStore = useAppStore()
const tabBarStore = useTabBarStore()
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()

const affixRef = ref()
const tagList = computed(() => {
  return tabBarStore.getTabList
})
const offsetTop = computed(() => {
  return appStore.app.navBar ? 60 : 0
})

watch(
  () => appStore.app.navBar,
  () => {
    affixRef.value.updatePosition()
  }
)

const tabScroll = (e: WheelEvent) => {
  console.log(e)
  const eventDelta = -e.deltaY * 40
  const tab_scroll_position =
    (scrollbarRef.value?.wrap$?.scrollLeft as number) + eventDelta
  scrollbarRef.value!.setScrollLeft(tab_scroll_position)
}

listenerRouteChange((route: RouteLocationNormalized) => {
  console.log('routechanged ', route)
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
  position: relative;
  background-color: var(--tab-bar-bg-color);
  .tab-bar-box {
    display: flex;
    width: 100%;
    padding: 1px 5px;
    .tags-wrap {
      padding: 4px 0;
      white-space: nowrap;
    }
  }

  .tag-bar-operation {
    width: 100px;
    height: 32px;
  }
}
</style>
