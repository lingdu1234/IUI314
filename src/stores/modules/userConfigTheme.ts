/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-01 14:50:08
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\stores\modules\userConfigTheme.ts
 * @Description: appStore
 */
import { ElMessage } from 'element-plus'
import { defineStore } from 'pinia'

import type { themeKey } from '@/hooks'

// 主题
interface Theme {
  setting: ThemeSetting
}

// 主题设置
export type ThemeSetting = Partial<Record<themeKey, string>>

export const useConfigThemeStore = defineStore('userConfigTheme', {
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
    resetTheme() {
      this.setting = {}
      ElMessage.success('两秒后界面将强制刷新')
      setTimeout(() => window.location.reload(), 2000)
    },
  },
})
