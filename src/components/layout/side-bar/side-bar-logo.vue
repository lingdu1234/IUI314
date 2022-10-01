<template>
  <div class="side-bar-logo-container">
    <img :src="logo" alt="logo" class="sidebar-logo" />
    <span class="logo-title">标图啊标题</span>
  </div>
</template>

<script lang="ts" setup name="side-bar-logo">
import logo from '@/assets/logo.svg';
</script>

<style lang="scss" scoped>
.side-bar-logo-container {
  height: var(--header-bar-height);
  background-color: var(--side-bar-logo-bg-color);
  display: flex;
  overflow: hidden;
  align-items: center;
  cursor: pointer;
  .sidebar-logo {
    margin-left: 5px;
    height: 32px;
    width: 32px;
  }
  .logo-title {
    font-size: 16px;
    font-weight: 800;
    margin-left: 20px;
  }
}
</style>
