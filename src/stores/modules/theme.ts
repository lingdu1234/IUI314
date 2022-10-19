/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-01 14:50:08
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-19 11:11:15
 * @FilePath: \IUI314\src\stores\modules\theme.ts
 * @Description: appStore
 */
import { defineStore } from 'pinia'

import type { themeKey } from '@/hooks'
// 主题
interface Theme {
  setting: ThemeSetting
}
// 主题设置
export type ThemeSetting = Partial<Record<themeKey, string>>

export const useThemeStore = defineStore('theme', {
  state: (): Theme => ({
    setting: {},
  }),
  persist: {
    paths: ['setting'],
  },
  actions: {
    setThemeSetting(v: ThemeSetting) {
      this.setting = v
    },
  },
})
