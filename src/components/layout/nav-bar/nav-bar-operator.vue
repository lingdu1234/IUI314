<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-01 21:22:30
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-22 21:51:56
 * @FilePath: \IUI314\src\components\layout\nav-bar\nav-bar-operator.vue
 * @Description: 
-->
<template>
  <div class="flex items-center justify-end">
    <div
      v-show="!appStore.device.isMobile"
      class="nav-bar-operator flex justify-evenly items-center"
    >
      <el-tooltip
        :content="t('common.search')"
        effect="light"
        placement="bottom"
      >
        <NavBarSearch />
      </el-tooltip>
      <el-tooltip :content="t('nav.theme')" effect="light" placement="bottom">
        <NavBarTheme />
      </el-tooltip>
      <el-tooltip
        :content="t('nav.fullScreen')"
        effect="light"
        placement="bottom"
      >
        <ScreenFull />
      </el-tooltip>
      <el-tooltip :content="t('nav.size')" effect="light" placement="bottom">
        <NavBarSize />
      </el-tooltip>
      <el-tooltip :content="t('nav.setting')" effect="light" placement="bottom">
        <AppSettings />
      </el-tooltip>
    </div>
    <div>
      <NavBarUser />
    </div>
  </div>
</template>

<script lang="ts" setup name="nav-bar-operator">
import { useI18n } from 'vue-i18n'

import AppSettings from '@/components/app/app-settings.vue'
import NavBarSearch from '@/components/app/nav-bar-search.vue'
import NavBarSize from '@/components/app/nav-bar-size.vue'
import NavBarTheme from '@/components/app/nav-bar-theme.vue'
import ScreenFull from '@/components/app/screen-full.vue'
import type { MessageSchema } from '@/i18n'
import { useAppStore } from '@/stores'

import NavBarUser from './nav-bar-user.vue'

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const appStore = useAppStore()
</script>
<style lang="scss" scoped>
.nav-bar-operator {
  width: var(--nav-bar-operation-width);
}
</style>
