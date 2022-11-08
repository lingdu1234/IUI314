<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-09-30 20:13:09
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\components\layout\Layout.vue
 * @Description: 
-->
<template>
  <div>
    <el-container v-if="!appStore.app.isLocked">
      <el-aside :style="sideBarWidth">
        <SideBar />
      </el-aside>
      <el-container class="flex flex-col justify-start w-100vw">
        <el-header class="headerNavBar" v-show="appStore.app.navBar">
          <NavBar />
        </el-header>
        <el-header class="headerNavBar">
          <TabBar v-if="appStore.app.tabBar" />
        </el-header>
        <el-main>
          <AppMain />
        </el-main>
      </el-container>
      <AppSettingsDrawer v-if="appStore.app.openSettingDrawer" />
    </el-container>
    <AppLockScreen v-if="appStore.app.isLocked" />
  </div>
</template>
<script lang="ts" setup name="lay-out">
import { ElAside, ElContainer, ElHeader, ElMain } from 'element-plus'
import { computed, watch } from 'vue'

import AppLockScreen from '@/components/lock-screen/app-lock-screen.vue'
import { useMobile } from '@/hooks'
import { useAppStore } from '@/stores'

import AppSettingsDrawer from '../app/app-settings-drawer.vue'
import AppMain from './app-main.vue'
import NavBar from './nav-bar/nav-bar.vue'
import SideBar from './side-bar/index.vue'
import TabBar from './tab-bar/tab-bar.vue'

const appStore = useAppStore()

const { isMobile } = useMobile()

watch(
  () => isMobile.value,
  (v) => appStore.toggleSideBar(v)
)

const sideBarWidth = computed(() =>
  appStore.sideBar.isCollapse
    ? { '--side-bar-width': 'var(--side-bar-isCollapse-width)' }
    : null
)
</script>

<style lang="scss" scoped>
.el-aside {
  width: var(--side-bar-width);
  background-color: var(--side-bar-bg-color);
  color: var(--side-bar-font-color);
  height: calc(var(--vh) * 100);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  justify-content: start;

  ul {
    background-color: rgb(235, 235, 235);
  }

  img {
    height: 32px;
    width: 32px;
    padding-left: 10px;
  }
}
.headerNavBar {
  height: var(--header-bar-height);
  background-color: var(--header-bar-bg-color);
  color: var(--header-bar-font-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.el-main {
  background-color: var(--main-container-bg-color);
  color: var(--main-container-font-color);
  padding: 0;
}
</style>
