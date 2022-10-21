/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-01 14:50:08
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-21 18:51:46
 * @FilePath: \IUI314\src\stores\modules\app.ts
 * @Description: appStore
 */
import { useFullscreen } from '@vueuse/core'
import { defineStore } from 'pinia'

import { useDynamicTitle } from '@/hooks'

interface AppStore {
  sideBar: {
    isCollapse: boolean
  }
  device: {
    isMobile: boolean
  }
  app: {
    title: string
    titleI18n?: string
    size: any
    dynamicTitle: boolean
    isDark: boolean | undefined
    theme: string
    lang: string
    navBar: boolean
    tabBar: boolean
    isScreenOut: boolean
    isFullscreen: boolean
    openSettingDrawer: boolean
  }
}
const { isFullscreen, toggle } = useFullscreen()

export const useAppStore = defineStore('app', {
  state: (): AppStore => ({
    sideBar: {
      isCollapse: false,
    },
    device: {
      isMobile: false,
    },
    app: {
      title: '',
      size: 'default',
      dynamicTitle: true,
      isDark: undefined,
      theme: '',
      lang: 'zh-CN',
      navBar: true,
      tabBar: true,
      isScreenOut: false,
      isFullscreen: false,
      openSettingDrawer: false,
    },
  }),
  persist: {
    paths: ['sideBar', 'device', 'app'],
  },
  actions: {
    toggleSideBar(isMobile?: boolean) {
      this.sideBar.isCollapse = isMobile ? isMobile : !this.sideBar.isCollapse
    },
    setIsMobile(isMobile: boolean) {
      this.device.isMobile = isMobile
    },
    setThemeColor(color: string) {
      this.app.isDark = color === 'dark'
      this.app.theme = color
    },
    setNavBar(navBarStatus: boolean) {
      this.app.navBar = navBarStatus
    },
    setTabBar(tabBarStatus: boolean) {
      this.app.tabBar = tabBarStatus
    },
    setSideBar(sideBarStatus: boolean) {
      this.sideBar.isCollapse = sideBarStatus
    },
    setAppTitle(title: string, i18nStr: string) {
      this.app.title = title
      this.app.titleI18n = i18nStr
      useDynamicTitle().setDynamicTitle()
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
    setDynamicTitle(dynamicTitle: boolean) {
      this.app.dynamicTitle = dynamicTitle
    },
    setAppSize(size: string) {
      this.app.size = size
    },
    setAppSettingDrawer(v: boolean) {
      this.app.openSettingDrawer = v
    },
    setLang(v: string) {
      this.app.lang = v
    },
  },
})
