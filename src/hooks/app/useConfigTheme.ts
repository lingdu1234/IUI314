/* eslint-disable no-unused-vars */

/*
 * @Author= lingdu waong2005@126.com
 * @Date: 2022-10-19 08:20:58
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\hooks\app\useConfigTheme.ts
 * @Description: 用户自定义主题
 */
import { useCssVar } from '@vueuse/core'
import { ref, watch } from 'vue'

import { type ThemeSetting, useAppStore, useConfigThemeStore } from '@/stores'

export enum themeKey {
  /** nav bar color 头部背景颜色 */
  headerBarBgColor = '--header-bar-bg-color',
  /** 头部字体颜色 */
  headerBarFontColor = '--header-bar-font-color',
  /** 侧边栏宽度 */
  sideBarWidth = '--side-bar-width',
  /** 侧边栏折叠后宽度 */
  sideBarIsCollapseWidth = '--side-bar-isCollapse-width',
  /** 侧边栏背景色 */
  sideBarBgColor = '--side-bar-bg-color',
  /** 侧边栏字体颜色 */
  sideBarFontColor = '--side-bar-font-color',
  /** 侧边栏LOGO背景颜色*/
  sideBarLogoBgColor = '--side-bar-logo-bg-color',
  /** 侧边栏LOGO字体颜色 */
  sideBarLogoTitleColor = '--side-bar-logo-title-color',
  /** 主容器背景颜色 */
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
  elMenuActiveBgColor = '--el-menu-item-active-bg-color',
  /** 菜单激活字体色 */
  elMenuActiveFontColor = '--el-menu-item-active-color',
  /** 面包屑字体颜色 */
  elBreadcrumbFontColor = '--el-breadcrumb-font-color',
  /** 滚动条颜色 */
  elScrollbarColor = '--el-scrollbar-color',
}

export const useConfigTheme = () => {
  const rootEl = document.documentElement
  const themes = ref<ThemeSetting>({})
  const themeStore = useConfigThemeStore()

  const setUserConfigTheme = () => {
    //  遍历enum
    for (const [, v] of Object.entries(themeKey)) {
      const color = useCssVar(v, rootEl)
      if (themeStore.setting[v]) {
        color.value = themeStore.setting[v]!
      }
      themes.value[v] = color.value
    }
  }

  // 监控数据并应用
  watch(
    () => themes.value,
    (v) => {
      if (useAppStore().app.theme === 'userConfig') {
        for (const item in v) {
          const color = useCssVar(item, rootEl)
          color.value = v[item as themeKey]!
          themeStore.setThemeSetting(v)
        }
      }
    },
    { deep: true },
  )
  return {
    themes,
    setUserConfigTheme,
  }
}
