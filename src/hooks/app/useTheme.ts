/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-01 21:31:05
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-19 20:03:13
 * @FilePath: \IUI314\src\hooks\app\useTheme.ts
 * @Description: theme
 */
import { usePreferredColorScheme } from '@vueuse/core'
import { ElMessage } from 'element-plus'

import { useAppStore } from '@/stores'

import { useConfigTheme } from './useConfigTheme'

export const useTheme = () => {
  const appStore = useAppStore()
  const theme_list: string[] = [
    'light',
    'dark',
    'classic',
    'pink',
    'gray',
    'userConfig',
  ]
  const theme_map: Record<string, string> = {
    light: '亮色',
    dark: '黑暗',
    classic: '经典',
    pink: '粉色',
    gray: '灰色',
    userConfig: '自定义',
  }

  // const node = window?.document.querySelector('html')
  const node = document.documentElement

  const setTheme = (theme: string) => {
    const last_color = appStore.app.theme
    init_theme(theme, last_color)
  }
  const nextColor = (step = 1) => {
    const last_color = appStore.app.theme
    const last_color_index = theme_list.indexOf(last_color)
    const index = (last_color_index + step) % theme_list.length
    init_theme(theme_list[index], last_color)
  }

  const notification = (theme: string) => {
    ElMessage.info('主题切换为:' + theme_map[theme] + '主题')
  }

  const init_theme = (color?: string, last_color?: string) => {
    if (last_color) {
      node?.classList.remove(last_color)
    }
    if (!color) {
      color = usePreferredColorScheme().value
    }
    if (color === 'userConfig') {
      // 如果是自定义主题，需设置主题
      useConfigTheme().setUserConfigTheme()
    }
    if (color !== 'userConfig') {
      // 如果主题不是‘userConfig’移除‘style’
      node?.removeAttribute('style')
    }
    node?.classList.add(color)

    appStore.setThemeColor(color)
    if (last_color) {
      notification(color)
    }
  }

  return {
    setTheme,
    nextColor,
    init_theme,
    theme_map,
    theme_list,
  }
}
