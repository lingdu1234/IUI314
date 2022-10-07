<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-09-30 21:43:45
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-07 11:45:34
 * @FilePath: \IUI314\src\components\layout\side-bar\index.vue
 * @Description: 
-->
<template>
  <SideBarLogo />
  <el-scrollbar class="overflow-x-hidden sider-menu">
    <SideBarMenu />
  </el-scrollbar>
  <!-- <div class="flex items-center justify-center m-b-5px">
    <el-icon size="large"><Setting /></el-icon>
  </div> -->
</template>
<script lang="ts" setup name="side-bar">
// import { Setting } from '@element-plus/icons-vue'

import SideBarLogo from './side-bar-logo.vue'
import SideBarMenu from './side-bar-menu.vue'
</script>
<style lang="scss" scoped>
.sider-menu {
  height: calc(100vh - var(--header-bar-height));
}
</style>
