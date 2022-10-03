/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-03 21:54:48
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-03 23:59:55
 * @FilePath: \IUI314\src\hooks\routes\useRouteGuard.ts
 * @Description:
 */
import type { Router, RouteRecordRaw } from 'vue-router'

import { usePermissionStore, useUserStore } from '@/stores'

import { useToken } from '../app/useDevice'
import { isHttp } from './useRouteUtl'
const whiteList = ['/login']

// routerGuard
export const useRouterGuard = (router: Router) => {
  router.beforeEach((to, _from, next) => {
    const { valid } = useToken()
    if (valid) {
      if (to.path === '/login') {
        next({ path: '/' })
      } else {
        const userStore = useUserStore()
        userStore
          .getUserInfo()
          .then(() => {
            const permissionStore = usePermissionStore()
            permissionStore.generateRoutes().then((rRoutes) => {
              rRoutes.forEach((route) => {
                if (!isHttp(route.path)) {
                  router.addRoute(route as RouteRecordRaw)
                }
              })
              // next({ ...to, replace: true })
            })
          })
          .catch(() => {
            //
          })
        next()
      }
    } else {
      // 没有token
      if (whiteList.indexOf(to.path) !== -1) {
        // 在免登录白名单，直接进入
        next()
      } else {
        next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      }
    }
  })

  router.afterEach(() => {
    // NProgress.done()
  })
}
