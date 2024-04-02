<script lang="ts" setup name="tab-bar-operation">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import TabBarItemDropdown from './tab-bar-item-dropdown.vue'
import { TabAction } from './useTabBar'
import { formatTag, useAppStore, useTabBarStore } from '@/stores'

const route = useRoute()
const loading = ref<boolean>(false)

const appStore = useAppStore()
const tabBarStore = useTabBarStore()

const currentRoute = computed(() => formatTag(route))

function refresh() {
  loading.value = true
  tabBarStore.tabActionSelect(currentRoute.value, TabAction.reload)
  setTimeout(() => {
    loading.value = false
  }, 2000)
}
</script>

<template>
  <div class="flex items-center justify-around z-999 tag-bar-operation">
    <IconRefresh class="cursor-pointer" :spin="loading" @click="refresh" />
    <a-dropdown
      class="cursor-pointer"
      trigger="click"
    >
      <IconDown class="cursor-pointer" />
      <template #content>
        <TabBarItemDropdown
          :item-data="currentRoute"
          :index="tabBarStore.getCurrentRouteIndex()"
        />
      </template>
    </a-dropdown>
    <div @click="appStore.toggleScreenOut">
      <IconFullscreenExit v-if="appStore.app.isScreenOut" class="cursor-pointer" />
      <IconFullscreen v-else class="cursor-pointer" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.tag-bar-operation {
  width: var(--tab-bar-operation-width);
  background-color: var(--header-bar-bg-color);
  height: var(--header-bar-height);
}
</style>
