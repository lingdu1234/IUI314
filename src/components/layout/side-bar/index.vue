<template>
  <SideBarLogo />
  <el-scrollbar class="overflow-x-hidden">
    <SideBarMenu />
  </el-scrollbar>
</template>
<script lang="ts" setup name="side-bar">
import SideBarLogo from './side-bar-logo.vue';
import SideBarMenu from './side-bar-menu.vue';
</script>
