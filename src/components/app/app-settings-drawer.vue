<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-18 19:12:36
 * @LastEditors: lingdu waong2005@126.com
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
      <span class="font-bold">{{ t('nav.app.setting') }}</span>
    </template>
    <el-divider content-position="left">
      {{ t('nav.app.setting') }}
    </el-divider>
    <el-form class="drawer-form" label-width="80px">
      <el-form-item :label="t('nav.app.language')">
        <el-select v-model="lang" @change="setLang">
          <el-option
            v-for="lang in langList"
            :key="lang.k"
            :label="lang.v"
            :value="lang.k"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('nav.app.animation')">
        <el-select v-model="animation" @change="setAnimation">
          <el-option
            v-for="v in animationList"
            :key="v"
            :label="v"
            :value="v"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('nav.theme')">
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
      <el-divider content-position="left">
        {{ t('nav.app.themeConfig') }}
      </el-divider>
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
import {
  ElButton,
  ElDivider,
  ElDrawer,
  ElForm,
  ElFormItem,
  ElOption,
  ElSelect,
} from 'element-plus'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useAnimation, useTheme } from '@/hooks'
import { langList, type MessageSchema } from '@/i18n'
import { useAppStore, useConfigThemeStore } from '@/stores'

import AppUserConfigTheme from './app-user-config-theme.vue'

const appStore = useAppStore()
const theme = ref(appStore.app.theme)
const lang = ref(appStore.app.lang)
const animation = ref(appStore.app.animation)
const configThemeStore = useConfigThemeStore()
const appSettingDrawerRef = ref(null)

const { setTheme, theme_list } = useTheme()
const handleClose = () => appStore.setAppSettingDrawer(false)
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const { locale } = useI18n()
const { setAnimation, animationList } = useAnimation()
// 修改主题
const set_theme = (v: string) => {
  setTheme(v)
}
// 修改语言
const setLang = (v: string) => {
  appStore.setLang(v)
  locale.value = v
}
</script>
<style lang="scss" scoped>
.el-divider--horizontal {
  margin: 16px 0 !important;
}
</style>
