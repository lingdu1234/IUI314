<script lang="ts" setup>
import { watch } from 'vue'

import AppMain from './app-main.vue'
import NavBar from './nav-bar/nav-bar.vue'
import SideBar from './side-bar/index.vue'
import TabBar from './tab-bar/tab-bar.vue'
import { useAppStore } from '@/stores'
import { parseTime, useMobile } from '@/hooks'
import AppLockScreen from '@/components/lock-screen/app-lock-screen.vue'

defineOptions({ name: 'Layout' })

const appStore = useAppStore()

const { isMobile } = useMobile()

watch(
  () => isMobile.value,
  v => appStore.toggleSideBar(v),
)
</script>

<template>
  <div>
    <a-watermark :content="['iui314', parseTime(new Date())]">
      <a-layout v-if="!appStore.app.isLocked">
        <a-layout-sider :width="appStore.sideBar.isCollapse ? 48 : 200">
          <SideBar />
        </a-layout-sider>
        <a-layout>
          <a-layout-header v-show="appStore.app.navBar" class="headerNavBar">
            <NavBar />
          </a-layout-header>
          <a-layout-header class="headerNavBar">
            <TabBar v-if="appStore.app.tabBar" />
          </a-layout-header>
          <a-layout-content>
            <AppMain />
          </a-layout-content>
        </a-layout>
      </a-layout>
      <AppLockScreen v-if="appStore.app.isLocked" />
    </a-watermark>
  </div>
</template>

<style lang="scss" scoped>
.arco-layout-sider {
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
.arco-layout-content {
  background-color: var(--main-container-bg-color);
  color: var(--main-container-font-color);
  padding: 0;
}
</style>
