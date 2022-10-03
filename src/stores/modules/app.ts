/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-01 14:50:08
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-03 09:14:52
 * @FilePath: \IUI314\src\stores\app\app.ts
 * @Description: appStore
 */
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    siderBar: {
      isCollapse: false,
    },
    device: {
      isMobile: false,
    },
    app: {
      isDark: true,
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
    setIsDark(isDark: boolean) {
      this.app.isDark = isDark
    },
  },
})
