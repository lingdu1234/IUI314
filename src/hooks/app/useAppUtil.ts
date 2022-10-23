/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-23 10:49:40
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-23 11:07:36
 * @FilePath: \IUI314\src\hooks\app\useAppUtil.ts
 * @Description:
 */
import { useAppStore } from '@/stores'

export const useAnimation = () => {
  const animationList = [
    'fade',
    'fade-transform',
    'slide-fade',
    'el-zoom-in-center',
  ]
  const appStore = useAppStore()
  const setAnimation = (v: string) => {
    appStore.setAnimation(v)
  }
  return {
    animationList,
    setAnimation,
  }
}
