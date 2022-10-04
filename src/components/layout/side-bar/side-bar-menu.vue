<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-09-30 21:49:15
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-04 07:16:45
 * @FilePath: \IUI314\src\components\layout\side-bar\side-bar-menu.vue
 * @Description: 
-->
<template>
  <el-menu
    :default-active="activeMenu"
    :collapse="appStore.siderBar.isCollapse"
    :unique-opened="true"
    :collapse-transition="false"
    mode="vertical"
  >
    <SideBarMenuItem
      v-for="(router, index) in routes"
      :key="router.path + index"
      :item="router"
      :base-path="router.path"
    />
  </el-menu>
</template>
<script lang="ts" setup name="side-bar-menu">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useAppStore, usePermissionStore } from '@/stores'

import SideBarMenuItem from './side-bar-menu-item.vue'

const appStore = useAppStore()
const permissionStore = usePermissionStore()

const routes = computed(() => permissionStore.routes)

const route = useRoute()
const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})
</script>

<style scoped>
.el-menu {
  font-weight: 900;
  border-style: none;
}
</style>
