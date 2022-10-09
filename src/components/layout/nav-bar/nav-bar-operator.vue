<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-01 21:22:30
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-09 14:22:58
 * @FilePath: \IUI314\src\components\layout\nav-bar\nav-bar-operator.vue
 * @Description: 
-->
<template>
  <div class="flex items-center justify-end">
    <div
      v-show="!appStore.device.isMobile"
      class="nav-bar-operator flex justify-evenly items-center"
    >
      <el-tooltip content="搜索" effect="light" placement="bottom">
        <NavBarSearch />
      </el-tooltip>
      <el-tooltip content="主题切换" effect="light" placement="bottom">
        <NavBarTheme />
      </el-tooltip>
      <el-tooltip content="主题轮换" effect="light" placement="bottom">
        <ThemeChange />
      </el-tooltip>
      <el-tooltip content="全屏切换" effect="light" placement="bottom">
        <ScreenFull />
      </el-tooltip>
      <el-tooltip content="布局大小切换" effect="light" placement="bottom">
        <NavBarSize />
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
import NavBarSize from '@/components/app/nav-bar-size.vue'
import NavBarTheme from '@/components/app/nav-bar-theme.vue'
import ScreenFull from '@/components/app/screen-full.vue'
import ThemeChange from '@/components/app/theme-change.vue'
import { useAppStore } from '@/stores'

import NavBarUser from './nav-bar-user.vue'

const appStore = useAppStore()
</script>
<style lang="scss" scoped>
.nav-bar-operator {
  width: var(--nav-bar-operation-width);
}
</style>
