<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-09-30 20:13:09
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-05 22:27:00
 * @FilePath: \IUI314\src\components\layout\Layout.vue
 * @Description: 
-->
<template>
  <div>
    <el-container>
      <el-aside :style="sideBarWidth">
        <SideBar />
      </el-aside>
      <el-container class="main-container">
        <el-header>
          <NavBar v-if="appStore.app.navBar" />
        </el-header>
        <TabBar v-if="appStore.app.tabBar" />
        <el-main>
          <AppMain />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script lang="ts" setup name="lay-out">
import { computed, watch } from 'vue'

import { useMobile } from '@/hooks/app/useDevice'
import { useAppStore } from '@/stores'

import AppMain from './app-main.vue'
import NavBar from './nav-bar/index.vue'
import SideBar from './side-bar/index.vue'
import TabBar from './tab-bar/tab-bar.vue'

const appStore = useAppStore()

const { isMobile } = useMobile()

watch(
  () => isMobile.value,
  (v) => appStore.toggleSiderBar(v)
)

const sideBarWidth = computed(() =>
  appStore.siderBar.isCollapse ? { '--sider-bar-width': 64 } : null
)
</script>

<style lang="scss" scoped>
.el-aside {
  width: var(--sider-bar-width);
  background-color: var(--sider-bar-bg-color);
  color: var(--sider-bar-font-color);
  height: 100vh;
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
.el-header {
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
  height: calc(100vh - var(--header-bar-height));
  padding: 0;
  overflow: hidden;

  .main-content {
    padding: 20px;
  }
}
</style>
