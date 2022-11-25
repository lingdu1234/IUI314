<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-01 21:22:30
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\components\layout\nav-bar\nav-bar-operator.vue
 * @Description: 
-->
<template>
  <div class="flex items-center justify-end">
    <div class="nav-bar-operator flex justify-evenly items-center">
      <el-tooltip :content="t('common.lock')" effect="light" placement="bottom">
        <NavBarLock />
      </el-tooltip>
      <el-tooltip
        :content="t('nav.app.language')"
        effect="light"
        placement="bottom"
      >
        <NavBarLanguage />
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

<script lang="ts" name="nav-bar-operator" setup>
import { ElTooltip } from 'element-plus'
import { useI18n } from 'vue-i18n'

import AppSettings from '@/components/app/app-settings.vue'
import NavBarLanguage from '@/components/app/nav-bar-language.vue'
import NavBarLock from '@/components/app/nav-bar-lock.vue'
import NavBarSize from '@/components/app/nav-bar-size.vue'
import NavBarTheme from '@/components/app/nav-bar-theme.vue'
import ScreenFull from '@/components/app/screen-full.vue'
import type { MessageSchema } from '@/i18n'

import NavBarUser from './nav-bar-user.vue'

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
</script>
<style lang="scss" scoped>
.nav-bar-operator {
  width: var(--nav-bar-operation-width);
}
</style>
