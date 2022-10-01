<template>
  <div>
    <el-container>
      <el-aside :style="sideBarWidth">
        <SideBar />
      </el-aside>
      <el-container>
        <el-header class="flex justify-between items-center">
          <NavBar />
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script lang="ts" setup>
import { computed, watch } from 'vue';

import { useMobile } from '@/hooks/app/useDevice';
import { useAppStore } from '@/stores';

import NavBar from './nav-bar/index.vue';
import SideBar from './side-bar/index.vue';

const appStore = useAppStore();

const { isMobile } = useMobile();

watch(
  () => isMobile.value,
  (v) => appStore.toggleSiderBar(v)
);

const sideBarWidth = computed(() =>
  appStore.siderBar.isCollapse ? { '--sider-bar-width': 64 } : null
);
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
