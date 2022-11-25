<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-09-30 21:43:45
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\components\layout\side-bar\index.vue
 * @Description: 
-->
<template>
  <SideBarLogo />
  <el-scrollbar class="overflow-x-hidden side-menu">
    <SideBarMenu />
  </el-scrollbar>
</template>
<script lang="ts" name="side-bar" setup>
import { ElScrollbar } from 'element-plus'

import SideBarLogo from './side-bar-logo.vue'
import SideBarMenu from './side-bar-menu.vue'
</script>
<style lang="scss" scoped>
.side-menu {
  height: calc(var(--vh) * 100 - var(--header-bar-height));
}
</style>
