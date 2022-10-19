/* eslint-disable no-unused-vars */

/*
 * @Author= lingdu waong2005@126.com
 * @Date: 2022-10-19 08:20:58
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-19 12:44:02
 * @FilePath: \IUI314\src\hooks\app\useConfigTheme.ts
 * @Description: 用户自定义主题
 */
import { useCssVar } from '@vueuse/core'
import { ref, watch } from 'vue'

import { type ThemeSetting, useThemeStore } from '@/stores'

export enum themeKey {
  /**主要色1 */
  mainColor_1 = '--main-color-1',
  /**主要色2 */
  mainColor_2 = '--main-color-2',
  /**主背景色 */
  mainBgColor = '--main-bg-color',
  /** nav bar color 头部背景颜色 默认为主颜色1 */
  headerBarBgColor = '--header-bar-bg-color',
  /** 头部字体颜色 */
  headerBarFontColor = '--header-bar-font-color',
  /** 侧边栏宽度 */
  sideBarWidth = '--side-bar-width',
  /** 侧边栏折叠后宽度 */
  sideBarIsCollapseWidth = '--side-bar-isCollapse-width',
  /** 侧边栏背景色 默认为 主颜色2 */
  sideBarBgColor = '--side-bar-bg-color',
  /** 侧边栏字体颜色 */
  sideBarFontColor = '--side-bar-font-color',
  /** 侧边栏LOGO背景颜色 默认为 主颜色2  */
  sideBarLogoBgColor = '--side-bar-logo-bg-color',
  /** 侧边栏LOGO字体颜色 */
  sideBarLogoTitleColor = '--side-bar-logo-title-color',
  /** 主容器背景颜色 默认为 主背景颜色*/
  mainContainerBgColor = '--main-container-bg-color',
  /** 主容器字体颜色*/
  mainContainerFontColor = '--main-container-font-color',
  /** Tab Bar 背景色 */
  tabBarBgColor = '--tab-bar-bg-color',
  /** Tab Bar Item 背景色 */
  tabBarItemBgColor = '--tab-bar-item-bg-color',
  /** Tab Bar Item 圆角 */
  tabBarItemBgRadius = '--tab-bar-item-bg-radius',
  /** Tab Bar Item 高度 */
  tabBarItemHeight = '--tab-bar-item-height',
  /** Tab Bar Item 操作区宽度 */
  tabBarOperationWidth = '--tab-bar-operation-width',
  /** Tab Bar Item 激活颜色 */
  tabBarItemActiveColor = '--tab-bar-item-active-color',
  /** Tab Bar Item 未激活颜色 */
  tabBarItemInactiveColor = '--tab-bar-item-inactive-color',
  /** Tab Bar Item 激活背景颜色 */
  tabBarItemActiveBgColor = '--tab-bar-item-active-bg-color',
  /** drop down 的图标颜色 */
  dropDownIconColor = '--drop-down-icon-color',
  //
  /** 菜单背景色 */
  elMenuBgColor = '--el-menu-bg-color',
  /** 菜单激活背景色 */
  elMenuActiveColor = '--el-menu-active-color',
}

// 不会遍历enum数据，多维护一份数据
export const themeKeyArray = [
  '--main-color-1',
  '--main-color-2',
  '--main-bg-color',
  //
  '--header-bar-bg-color',
  '--header-bar-font-color',
  //
  '--side-bar-width',
  '--side-bar-isCollapse-width',
  '--side-bar-bg-color',
  '--side-bar-font-color',
  '--side-bar-logo-bg-color',
  '--side-bar-logo-title-color',
  //
  '--main-container-bg-color',
  '--main-container-font-color',
  //
  '--tab-bar-bg-color',
  '--tab-bar-item-bg-color',
  '--tab-bar-item-bg-radius',
  '--tab-bar-item-height',
  '--tab-bar-operation-width',
  '--tab-bar-item-active-color',
  '--tab-bar-item-inactive-color',
  '--tab-bar-item-active-bg-color',
  //
  '--drop-down-icon-color',
  //
  '--el-menu-bg-color',
  '--el-menu-active-color',
]
export const useConfigTheme = () => {
  const rootEl = document.documentElement
  const themes = ref<ThemeSetting>({})
  const themeStore = useThemeStore()

  const setUserConfigTheme = () => {
    for (const item of themeKeyArray) {
      const color = useCssVar(item, rootEl)
      if (themeStore.setting[item as themeKey]) {
        color.value = themeStore.setting[item as themeKey]!
      }
      themes.value[item as themeKey] = color.value
    }
  }

  // 监控数据并应用
  watch(
    () => themes.value,
    (v) => {
      for (const item in v) {
        const color = useCssVar(item, rootEl)
        color.value = v[item as themeKey]!
        themeStore.setThemeSetting(v)
      }
    },
    { deep: true }
  )
  setUserConfigTheme()
  return {
    themes,
    setUserConfigTheme,
  }
}
