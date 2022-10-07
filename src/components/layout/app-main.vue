<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-05 17:46:35
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-07 22:25:33
 * @FilePath: \IUI314\src\components\layout\app-main.vue
 * @Description: 
-->
<template>
  <section class="app-main">
    <el-scrollbar :style="height">
      <router-view v-slot="{ Component, route }">
        <transition name="fade-transform" mode="out-in">
          <keep-alive :include="cacheList">
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </transition>
      </router-view>
    </el-scrollbar>
  </section>
</template>

<script lang="ts" setup name="app-main">
import { computed } from 'vue'

import { useAppStore, useTabBarStore } from '@/stores'

const tabBarStore = useTabBarStore()
const appStore = useAppStore()

const height = computed(() => {
  if (appStore.app.navBar) {
    return 'height: calc(100vh - 90px)'
  }
  if (appStore.app.tabBar) {
    return 'height: calc(100vh - 110px)'
  }
  return 'height: 100vh'
})

const appMainHeight = computed(() => {
  if (appStore.app.navBar) {
    return 'calc(100vh - 84px)'
  }
  if (appStore.app.tabBar) {
    return 'calc(100vh - 106px)'
  }
  return '100vh'
})

const cacheList = computed(() => tabBarStore.getCacheList)
</script>

<style lang="scss" scoped>
.app-main {
  min-height: v-bind(appMainHeight);
  width: 100%;
  position: relative;
  overflow: hidden;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 17px;
  }
}
</style>
