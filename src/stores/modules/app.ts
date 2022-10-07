/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-01 14:50:08
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-07 12:26:48
 * @FilePath: \IUI314\src\stores\modules\app.ts
 * @Description: appStore
 */
import { useFullscreen } from '@vueuse/core'
import { defineStore } from 'pinia'

import { useDynamicTitle } from '@/hooks'

interface AppStore {
  siderBar: {
    isCollapse: boolean
  }
  device: {
    isMobile: boolean
  }
  app: {
    name: string
    title: string
    dynamicTitle: boolean
    isDark: boolean | undefined
    theme: string
    lang: string
    navBar: boolean
    tabBar: boolean
    isScreenOut: boolean
    isFullscreen: boolean
  }
}
const { isFullscreen, toggle } = useFullscreen()

export const useAppStore = defineStore('app', {
  state: (): AppStore => ({
    siderBar: {
      isCollapse: false,
    },
    device: {
      isMobile: false,
    },
    app: {
      name: import.meta.env.VITE_APP_TITLE,
      title: '',
      dynamicTitle: true,
      isDark: undefined,
      theme: '',
      lang: 'zh-CN',
      navBar: true,
      tabBar: true,
      isScreenOut: false,
      isFullscreen: false,
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
    setNavBar(navBarStatus: boolean) {
      this.app.navBar = navBarStatus
    },
    setTabBar(tabBarStatus: boolean) {
      this.app.tabBar = tabBarStatus
    },
    setSideBar(sideBarStatus: boolean) {
      this.siderBar.isCollapse = sideBarStatus
    },
    setAppName(name: string) {
      this.app.name = name
    },
    setAppTitle(title: string) {
      this.app.title = title
      useDynamicTitle()
    },
    toggleScreenOut() {
      this.app.isScreenOut = !this.app.isScreenOut
      this.setSideBar(this.app.isScreenOut)
      this.setNavBar(!this.app.isScreenOut)
    },
    toggleFullScreen() {
      this.app.isFullscreen = !this.app.isFullscreen
      isFullscreen.value = !this.app.isFullscreen
      toggle()
    },
    setDynamicTitle(isynamicTitle: boolean) {
      this.app.dynamicTitle = isynamicTitle
    },
  },
})