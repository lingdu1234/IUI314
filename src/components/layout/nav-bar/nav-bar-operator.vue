<template>
  <div v-show="!appStore.device.isMobile" class="flex justify-between">
    <div class="w-200px flex justify-evenly items-center">
      <el-tooltip content="搜索" effect="light" placement="bottom">
        <NavBarSearch />
      </el-tooltip>
      <el-tooltip content="语言切换" effect="light" placement="bottom">
        <NavBarLanguage />
      </el-tooltip>
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
import NavBarLanguage from '@/components/app/nav-bar-language.vue'
import NavBarSearch from '@/components/app/nav-bar-search.vue'
import ScreenFull from '@/components/app/screen-full.vue'
import ThemeChange from '@/components/app/theme-change.vue'
import { useAppStore } from '@/stores'

import NavBarUser from './nav-bar-user.vue'

const appStore = useAppStore()
//
</script>
