<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-18 19:12:36
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-19 11:17:16
 * @FilePath: \IUI314\src\components\app\app-settings-drawer.vue
 * @Description: 
-->
<template>
  <el-drawer
    ref="appSettingDrawerRef"
    v-model="appStore.app.openSettingDrawer"
    direction="rtl"
    :with-header="false"
    :before-close="handleClose"
    size="300px"
    class="app-setting-drawer"
  >
    <span class="font-bold">App 设置</span>
    <el-divider />
    <el-divider content-position="left">主题设置</el-divider>
    <el-form class="drawer-form" label-width="80px">
      <el-form-item label="主题设置">
        <el-select v-model="theme" @change="set_theme">
          <el-option
            v-for="theme in theme_list"
            :key="theme"
            :label="theme_map[theme]"
            :value="theme"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-divider
      v-if="appStore.app.theme === 'userConfig'"
      content-position="left"
    >
      自定义设置
    </el-divider>
    <el-form
      class="drawer-form"
      label-width="80px"
      v-if="appStore.app.theme === 'userConfig'"
    >
      <el-form-item label="头部颜色">
        <el-color-picker
          v-model="themes[themeKey.headerBarBgColor]"
          show-alpha
          :predefine="predefineColors"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="flex: auto">
        <el-button>cancel</el-button>
        <el-button type="primary">confirm</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup name="app-settings-drawer">
import { ref } from 'vue'

import { themeKey, useConfigTheme, useTheme } from '@/hooks'
import { useAppStore } from '@/stores'
const appStore = useAppStore()
const theme = ref(appStore.app.theme)
const appSettingDrawerRef = ref(null)

const { setTheme, theme_map, theme_list } = useTheme()
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
const handleClose = () => appStore.setAppSettingDrawer(false)
// const navBarColor = ref(themeStore.setting.headerBarBgColor)

const { themes } = useConfigTheme()
console.log('themes :>> ', themes.value)

const set_theme = (v: string) => {
  setTheme(v)
}
</script>
<style lang="scss" scoped>
.el-divider--horizontal {
  margin: 12px 0 !important;
}
.el-form-item__content {
  display: flex !important;
  justify-content: flex-end !important;
}
</style>
