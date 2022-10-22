<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-09-30 21:43:45
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-22 21:44:21
 * @FilePath: \IUI314\src\components\layout\side-bar\index.vue
 * @Description: 
-->
<template>
  <SideBarLogo />
  <el-scrollbar class="overflow-x-hidden side-menu">
    <SideBarMenu />
  </el-scrollbar>
</template>
<script lang="ts" setup name="side-bar">
import SideBarLogo from './side-bar-logo.vue'
import SideBarMenu from './side-bar-menu.vue'
</script>
<style lang="scss" scoped>
.side-menu {
  height: calc(100vh - var(--header-bar-height));
}
</style>
