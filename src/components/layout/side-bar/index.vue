<template>
  <SideBarLogo />
  <el-scrollbar class="overflow-x-hidden sider-menu">
    <SideBarMenu />
  </el-scrollbar>
</template>
<script lang="ts" setup name="side-bar">
import SideBarLogo from './side-bar-logo.vue';
import SideBarMenu from './side-bar-menu.vue';
</script>
<style lang="scss" scoped>
.sider-menu {
  height: calc(100vh - var(--header-bar-height));
}
</style>
