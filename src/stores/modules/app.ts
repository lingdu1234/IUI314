/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-01 14:50:08
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-04 12:32:41
 * @FilePath: \IUI314\src\stores\modules\app.ts
 * @Description: appStore
 */
import { defineStore } from 'pinia'

interface AppStore {
  siderBar: {
    isCollapse: boolean
  }
  device: {
    isMobile: boolean
  }
  app: {
    isDark: boolean | undefined
    theme: string
    lang: string
  }
}

export const useAppStore = defineStore('app', {
  state: (): AppStore => ({
    siderBar: {
      isCollapse: false,
    },
    device: {
      isMobile: false,
    },
    app: {
      isDark: undefined,
      theme: '',
      lang: 'zh-CN',
    },
  }),
  persist: {
    paths: ['siderBar', 'device', 'app'],
  },
  actions: {
    toggleSiderBar(isMobile?: boolean) {
      this.siderBar.isCollapse = isMobile ? isMobile : !this.siderBar.isCollapse
    },
    setIsMobile(isMobile: boolean) {
      this.device.isMobile = isMobile
    },
    setThemeColor(color: string) {
      this.app.isDark = color === 'dark' ? true : false
      this.app.theme = color
    },
  },
})
