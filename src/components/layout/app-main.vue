<script lang="ts" setup>
import { computed } from 'vue'

import { useRoute } from 'vue-router'
import { useAppStore, useTabBarStore } from '@/stores'

defineOptions({ name: 'AppMain' })

const tabBarStore = useTabBarStore()
const appStore = useAppStore()

tabBarStore.setCurrentRoute(useRoute())

const appMainHeight = computed(() => {
  let h = 'calc(var(--vh) * 100'
  if (appStore.app.navBar)
    h += ' - var(--header-bar-height)'

  if (appStore.app.tabBar)
    h += ' - var(--header-bar-height)'

  h += ')'
  return h
})

const height = computed(() => `height: ${appMainHeight.value}`)

const cacheList = computed(() => tabBarStore.getCacheList)
</script>

<template>
  <a-scrollbar :style="height">
    <router-view v-slot="{ Component, route }">
      <transition :name="appStore.app.animation" mode="out-in">
        <keep-alive :include="cacheList">
          <component :is="Component" :key="route.path" class="p-l-10px p-r-10px" />
        </keep-alive>
      </transition>
    </router-view>
  </a-scrollbar>
</template>

<style lang="scss" scoped></style>
