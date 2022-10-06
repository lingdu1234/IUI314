<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-01 21:22:30
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-04 16:57:26
 * @FilePath: \IUI314\src\components\layout\nav-bar\nav-bar-operator.vue
 * @Description: 
-->
<template>
  <div
    class="flex items-center justify-end"
    :class="!appStore.device.isMobile ? '300px' : '100px'"
  >
    <div
      v-show="!appStore.device.isMobile"
      class="w-200px flex justify-evenly items-center"
    >
      <el-tooltip content="搜索" effect="light" placement="bottom">
        <NavBarSearch />
      </el-tooltip>
      <!-- <el-tooltip content="语言切换" effect="light" placement="bottom"> -->
      <NavBarTheme />
      <!-- </el-tooltip> -->
      <el-tooltip content="主题切换" effect="light" placement="bottom">
        <ThemeChange />
      </el-tooltip>
      <el-tooltip content="全屏切换" effect="light" placement="bottom">
        <ScreenFull />
      </el-tooltip>
      <el-tooltip content="设置" effect="light" placement="bottom">
        <AppSettings />
      </el-tooltip>
    </div>
    <div>
      <NavBarUser />
    </div>
  </div>
</template>

<script lang="ts" setup name="nav-bar-operator">
import AppSettings from '@/components/app/app-settings.vue'
import NavBarSearch from '@/components/app/nav-bar-search.vue'
import ScreenFull from '@/components/app/screen-full.vue'
import ThemeChange from '@/components/app/theme-change.vue'
import { useAppStore } from '@/stores'

import NavBarTheme from '../../app/nav-bar-theme.vue'
import NavBarUser from './nav-bar-user.vue'

const appStore = useAppStore()
//
</script>
