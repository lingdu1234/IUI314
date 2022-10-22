<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-18 19:12:36
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-22 09:56:44
 * @FilePath: \IUI314\src\components\app\app-settings-drawer.vue
 * @Description: 
-->
<template>
  <el-drawer
    ref="appSettingDrawerRef"
    v-model="appStore.app.openSettingDrawer"
    direction="rtl"
    :before-close="handleClose"
    size="300px"
  >
    <template #header>
      <span class="font-bold">App 设置</span>
    </template>
    <el-divider content-position="left">主题设置</el-divider>
    <el-form class="drawer-form" label-width="80px">
      <el-form-item label="语言设置">
        <el-select v-model="lang" @change="setLang">
          <el-option label="中文" value="zh-CN" />
          <el-option label="English" value="en-US" />
        </el-select>
      </el-form-item>
      <el-form-item label="主题设置">
        <el-select v-model="theme" @change="set_theme">
          <el-option
            v-for="theme in theme_list"
            :key="theme"
            :label="t(`theme.${theme}`)"
            :value="theme"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div v-if="appStore.app.theme === 'userConfig'">
      <el-divider content-position="left"> 自定义设置 </el-divider>
      <!-- 主题相关自定义设置 -->
      <AppUserConfigTheme />
    </div>
    <template #footer>
      <div class="flex-auto">
        <el-button @click="configThemeStore.resetTheme">重置</el-button>
        <el-button type="info">取消</el-button>
        <el-button type="primary">复制</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup name="app-settings-drawer">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useTheme } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { useAppStore, useConfigThemeStore } from '@/stores'

import AppUserConfigTheme from './app-user-config-theme.vue'

const appStore = useAppStore()
const theme = ref(appStore.app.theme)
const lang = ref(appStore.app.lang)
const configThemeStore = useConfigThemeStore()
const appSettingDrawerRef = ref(null)

const { setTheme, theme_list } = useTheme()
const handleClose = () => appStore.setAppSettingDrawer(false)
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const { locale } = useI18n()
// 修改主题
const set_theme = (v: string) => {
  setTheme(v)
}
// 修改语言
const setLang = (v: string) => {
  appStore.setLang(v)

  console.log('locale :>> ', locale.value)
  locale.value = v
}
</script>
<style lang="scss" scoped>
.el-divider--horizontal {
  margin: 16px 0 !important;
}
</style>
