/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-01 21:31:05
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-29 08:46:02
 * @FilePath: \IUI314\src\hooks\app\useTheme.ts
 * @Description: theme
 */
import { usePreferredColorScheme } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

import type { MessageSchema } from '@/i18n'
import { useAppStore } from '@/stores'

import { useSetVh } from './useAppUtil'
import { useConfigTheme } from './useConfigTheme'

export const useTheme = () => {
  const appStore = useAppStore()
  // const { i18n } = useSetupI18n()
  // const { t } = i18n.global
  const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
  const theme_list: string[] = [
    'light',
    'dark',
    'classic',
    'pink',
    'gray',
    'userConfig',
  ]

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
    ElMessage.info(t('theme.changeTip') + t(`theme.${theme}`))
  }

  const init_theme = (color?: string, last_color?: string) => {
    if (last_color) {
      node?.classList.remove(last_color)
    }
    if (!color) {
      color = appStore.app.theme || usePreferredColorScheme().value
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
    // 主题设置完成，设置自定义vh
    useSetVh().setVh()
  }
  init_theme()
  return {
    setTheme,
    nextColor,
    init_theme,
    theme_list,
  }
}
