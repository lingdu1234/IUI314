<template>
  <router-link to="/index" class="side-bar-logo-container">
    <div class="w-64px flex items-center justify-center">
      <img :src="logo" alt="logo" class="w-32px h-32px" />
    </div>
    <div v-if="!appStore.siderBar.isCollapse" class="w-136px">
      <span class="logo-title"> 标图 </span>
    </div>
  </router-link>
</template>

<script lang="ts" setup name="side-bar-logo">
import logo from '@/assets/logo.svg'
import { useAppStore } from '@/stores'
const appStore = useAppStore()
</script>

<style lang="scss" scoped>
.side-bar-logo-container {
  height: var(--header-bar-height);
  background-color: var(--side-bar-logo-bg-color);
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: flex-start;
  text-decoration: none;
  cursor: pointer;
  .logo-title {
    // width: 120px;
    font-size: 20px;
    font-weight: 800;
    margin-left: 1px;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--side-bar-logo-title-color);
  }
}
</style>
