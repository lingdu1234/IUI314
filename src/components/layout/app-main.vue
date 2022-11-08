<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-05 17:46:35
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\components\layout\app-main.vue
 * @Description: 
-->
<template>
  <el-scrollbar :style="height">
    <router-view v-slot="{ Component, route }">
      <transition :name="appStore.app.animation" mode="out-in">
        <keep-alive :include="cacheList">
          <component class="m-15px" :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
  </el-scrollbar>
</template>

<script lang="ts" setup name="app-main">
import { ElScrollbar } from 'element-plus'
import { computed } from 'vue'

import { useAppStore, useTabBarStore } from '@/stores'

const tabBarStore = useTabBarStore()
const appStore = useAppStore()

const appMainHeight = computed(() => {
  let h = 'calc(var(--vh) * 100'
  if (appStore.app.navBar) {
    h += ' - var(--header-bar-height)'
  }
  if (appStore.app.tabBar) {
    h += ' - var(--header-bar-height)'
  }
  h += ')'
  return h
})

const height = computed(() => 'height: ' + appMainHeight.value)

const cacheList = computed(() => tabBarStore.getCacheList)
</script>

<style lang="scss" scoped></style>
