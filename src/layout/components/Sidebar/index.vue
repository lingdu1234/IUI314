<template>
  <div
    :class="{ 'has-logo': showLogo }"
  >
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar :class="sideTheme" wrap-class="scrollbar-wrapper">
      <el-menu
        class="side-menu"
        :default-active="activeMenu" :collapse="isCollapse"
        :unique-opened="true"
        :active-text-color="theme" :collapse-transition="false" mode="vertical"
      >
        <sidebar-item
          v-for="(router, index) in sidebarRouters" :key="router.path + index" :item="router"
          :base-path="router.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

import useAppStore from "@/store/modules/app"
import usePermissionStore from "@/store/modules/permission"
import useSettingsStore from "@/store/modules/settings"

import Logo from "./Logo"
import SidebarItem from "./SidebarItem"

const route = useRoute();
const appStore = useAppStore()
const settingsStore = useSettingsStore()
const permissionStore = usePermissionStore()



const sidebarRouters = computed(() => permissionStore.sidebarRouters);
const showLogo = computed(() => settingsStore.sidebarLogo);
const sideTheme = computed(() => settingsStore.sideTheme);
const theme = computed(() => settingsStore.theme);
const isCollapse = computed(() => !appStore.sidebar.opened);


const activeMenu = computed(() => {
  const { meta, path } = route;
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
})

</script>