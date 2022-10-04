/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-01 21:31:05
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-04 12:48:47
 * @FilePath: \IUI314\src\hooks\app\useTheme.ts
 * @Description: theme
 */
import { ElMessage } from 'element-plus'

import { useAppStore } from '@/stores'

export const useTheme = () => {
  const appStore = useAppStore()
  const theme_list: string[] = ['light', 'dark', 'classic', 'pink', 'gray']
  const theme_map: Record<string, string> = {
    light: '亮色',
    dark: '黑暗',
    classic: '经典',
    pink: '粉色',
    gray: '灰色',
  }

  const node = window?.document.querySelector('html')

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
    appStore.setThemeColor(theme)
    ElMessage.info('主题切换为:' + theme_map[theme] + '主题')
  }

  const init_theme = (color: string, last_color?: string) => {
    if (last_color) {
      node?.classList.remove(last_color)
    }
    node?.classList.add(color)
    notification(color)
  }

  init_theme(appStore.app.theme)
  return {
    isDark: appStore.app.isDark,
    colorMode: appStore.app.theme,
    setTheme,
    nextColor,
  }
}
