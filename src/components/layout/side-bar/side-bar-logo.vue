<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-09-30 21:45:51
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-21 20:57:07
 * @FilePath: \IUI314\src\components\layout\side-bar\side-bar-logo.vue
 * @Description: 
-->
<template>
  <router-link to="/index" class="side-bar-logo-container">
    <div class="w-60px flex items-center justify-center">
      <img :src="logo" alt="logo" class="w-32px h-32px" />
    </div>
    <div v-if="!appStore.sideBar.isCollapse" class="w-136px">
      <span class="logo-title truncate m-l-1px font-800">
        {{ t('APP') }}
      </span>
    </div>
  </router-link>
</template>

<script lang="ts" setup name="side-bar-logo">
import logo from '@/assets/logo.svg'
import { useSetupI18n } from '@/i18n'
import { useAppStore } from '@/stores'
const appStore = useAppStore()
const { i18n } = useSetupI18n()
const { t } = i18n.global
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
    // font-weight: 800;
    // margin-left: 1px;
    // text-overflow: ellipsis;
    // white-space: nowrap;
    color: var(--side-bar-logo-title-color);
  }
}
</style>
