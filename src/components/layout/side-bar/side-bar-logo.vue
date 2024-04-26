<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

import logo from '@/assets/logo.svg'
import type { MessageSchema } from '@/i18n'
import { useAppStore } from '@/stores'

defineOptions({ name: 'SideBarLogo' })

const appStore = useAppStore()
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
</script>

<template>
  <router-link to="/index" class="side-bar-logo-container " :class="appStore.sideBar.isCollapse ? 'w-48px' : ''">
    <div class="w-48px flex items-center justify-center">
      <img
        :src="logo"
        alt="logo"
        class="w-32px h-32px"
      >
    </div>
    <div v-if="!appStore.sideBar.isCollapse" class="w-136px">
      <span class="logo-title truncate m-l-1px font-800">
        {{ t('app.APP') }}
      </span>
    </div>
  </router-link>
</template>

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
    font-size: 20px;
    color: var(--side-bar-logo-title-color);
  }
}
</style>
