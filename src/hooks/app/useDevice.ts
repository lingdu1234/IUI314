/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-01 19:56:42
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-07 13:58:53
 * @FilePath: \IUI314\src\hooks\app\useDevice.ts
 * @Description: 设备相关
 */
import { useWindowSize } from '@vueuse/core'
import { ref, watch } from 'vue'

import { useAppStore, useUserStore } from '@/stores'

export const useMobile = () => {
  const appStore = useAppStore()
  const { width } = useWindowSize()
  const isMobile = ref(false)
  const mobileWidth = 768
  watch(
    () => width.value,
    (v: number) => {
      isMobile.value = v > mobileWidth ? false : true
      appStore.setIsMobile(isMobile.value)
    }
  )
  return {
    isMobile,
  }
}

export const useToken = () => {
  const userStore = useUserStore()
  const now = new Date().getTime() / 1000 //分钟
  const exp = (userStore.token.expires - now) / (24 * 60 * 60) // 天
  const isExpiredSoon = exp < 1 ? true : false
  const valid = exp > 0 ? true : false
  return {
    isExpiredSoon,
    valid,
    token: `${userStore.token.type} ${userStore.token.value}`,
  }
}
