<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-19 20:08:58
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\components\app\app-user-config-theme.vue
 * @Description: 
-->
<template>
  <el-form class="drawer-form" label-width="200px" label-position="left">
    <el-form-item label="头部颜色">
      <el-color-picker
        v-model="themes[themeKey.headerBarBgColor]"
        show-alpha
        :predefine="predefineColors"
      />
    </el-form-item>
    <el-form-item label="头部字体颜色">
      <el-color-picker
        v-model="themes[themeKey.headerBarFontColor]"
        show-alpha
        :predefine="predefineColors"
      />
    </el-form-item>
    <el-form-item label="侧栏宽度">
      <el-input v-model="themes[themeKey.sideBarWidth]" />
    </el-form-item>
    <el-form-item label="侧栏折叠宽度">
      <el-input v-model="themes[themeKey.sideBarIsCollapseWidth]" />
    </el-form-item>
    <el-form-item label="侧栏字体颜色">
      <el-color-picker
        v-model="themes[themeKey.sideBarFontColor]"
        show-alpha
        :predefine="predefineColors"
      />
    </el-form-item>
    <el-form-item label="侧栏Logo背景">
      <el-color-picker
        v-model="themes[themeKey.sideBarLogoBgColor]"
        show-alpha
        :predefine="predefineColors"
      />
    </el-form-item>
    <el-form-item label="侧栏Logo字体">
      <el-color-picker
        v-model="themes[themeKey.sideBarLogoTitleColor]"
        show-alpha
        :predefine="predefineColors"
      />
    </el-form-item>
    <el-form-item label="主容器背景">
      <el-color-picker
        v-model="themes[themeKey.mainContainerBgColor]"
        show-alpha
        :predefine="predefineColors"
      />
    </el-form-item>
    <el-form-item label="主容器字体">
      <el-color-picker
        v-model="themes[themeKey.mainContainerFontColor]"
        show-alpha
        :predefine="predefineColors"
      />
    </el-form-item>
    <el-form-item label="TabBar背景">
      <el-color-picker
        v-model="themes[themeKey.tabBarBgColor]"
        show-alpha
        :predefine="predefineColors"
      />
    </el-form-item>
    <el-form-item label="TabBarItem未激活背景">
      <el-color-picker
        v-model="themes[themeKey.tabBarItemBgColor]"
        show-alpha
        :predefine="predefineColors"
      />
    </el-form-item>
    <el-form-item label="TabBarItem激活颜色">
      <el-color-picker
        v-model="themes[themeKey.tabBarItemActiveColor]"
        show-alpha
        :predefine="predefineColors"
      />
    </el-form-item>
    <el-form-item label="TabBarItem未激活颜色">
      <el-color-picker
        v-model="themes[themeKey.tabBarItemInactiveColor]"
        show-alpha
        :predefine="predefineColors"
      />
    </el-form-item>
    <el-form-item label="TabBarItem激活背景颜色">
      <el-color-picker
        v-model="themes[themeKey.tabBarItemActiveBgColor]"
        show-alpha
        :predefine="predefineColors"
      />
    </el-form-item>
    <el-form-item label="TabBarItem圆角">
      <el-input v-model="themes[themeKey.tabBarItemBgRadius]" />
    </el-form-item>
    <el-form-item label="TabBarItem高度">
      <el-input v-model="themes[themeKey.tabBarItemHeight]" />
    </el-form-item>
    <el-form-item label="TabBar操作区宽度">
      <el-input v-model="themes[themeKey.tabBarOperationWidth]" />
    </el-form-item>
    <el-form-item label="下拉菜单图标颜色">
      <el-color-picker
        v-model="themes[themeKey.dropDownIconColor]"
        show-alpha
        :predefine="predefineColors"
      />
    </el-form-item>
    <el-form-item label="菜单背景颜色">
      <el-color-picker
        v-model="themes[themeKey.elMenuBgColor]"
        show-alpha
        :predefine="predefineColors"
      />
    </el-form-item>
    <el-form-item label="菜单激活背景色">
      <el-color-picker
        v-model="themes[themeKey.elMenuActiveBgColor]"
        show-alpha
        :predefine="predefineColors"
      />
    </el-form-item>
    <el-form-item label="菜单激活字体色">
      <el-color-picker
        v-model="themes[themeKey.elMenuActiveFontColor]"
        show-alpha
        :predefine="predefineColors"
      />
    </el-form-item>
    <el-form-item label="面包屑字体色">
      <el-color-picker
        v-model="themes[themeKey.elBreadcrumbFontColor]"
        show-alpha
        :predefine="predefineColors"
      />
    </el-form-item>
    <el-form-item label="滚动条颜色">
      <el-color-picker
        v-model="themes[themeKey.elScrollbarColor]"
        show-alpha
        :predefine="predefineColors"
      />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup name="app-settings-drawer">
import { ref } from 'vue'

import { themeKey, useConfigTheme } from '@/hooks'

const { themes, setUserConfigTheme } = useConfigTheme()

setUserConfigTheme()

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
</script>
