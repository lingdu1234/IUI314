<script lang="ts"  setup>
import { computed } from 'vue'

import SideBarMenuItem from './side-bar-menu-item.vue'
import { useAppStore, usePermissionStore } from '@/stores'

defineOptions({ name: 'SideBarMenu' })

const appStore = useAppStore()
const permissionStore = usePermissionStore()

const routes = computed(() => permissionStore.routes)

// 监听侧边栏折叠 按钮
function click_collapse_icon(v: boolean) {
  appStore.setSideBar(v)
}
</script>

<template>
  <a-menu
    :collapsed="appStore.sideBar.isCollapse"
    mode="vertical"
    collapsible
    accordion
    show-collapse-button
    class="side-menu"
    @collapse="click_collapse_icon"
  >
    <SideBarMenuItem
      v-for="(router, index) in routes"
      :key="router.path + index"
      :base-path="router.path"
      :item="router"
    />
  </a-menu>
</template>
