<script lang="ts" setup>
import SideBarLogo from './side-bar-logo.vue'
import SideBarMenu from './side-bar-menu.vue'

defineOptions({ name: 'SideBar' })
</script>

<template>
  <SideBarLogo />
  <a-scrollbar class="overflow-x-hidden side-menu">
    <SideBarMenu />
  </a-scrollbar>
</template>
