/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-05 20:33:53
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\hooks\util\useMitt.ts
 * @Description:
 */
/**
 * Listening to routes alone would waste rendering performance.
 * Use the publish-subscribe model for distribution management
 * 单独监听路由会浪费渲染性能。使用发布订阅模式去进行分发管理。
 */
import mitt, { type Handler } from 'mitt'
import type { RouteLocationNormalized } from 'vue-router'

import type { Eaction } from '@/components/layout/tab-bar/useTabBar'

const emitter = mitt()

const routerChangeKey = Symbol('ROUTE_CHANGE')
const tabActionMethodKey = Symbol('TAB_ACTION_METHOD')

let latestRoute: RouteLocationNormalized

export function setRouteEmitter(to: RouteLocationNormalized) {
  emitter.emit(routerChangeKey, to)
  latestRoute = to
}

export function listenerRouteChange(
  // eslint-disable-next-line no-unused-vars
  handler: (route: RouteLocationNormalized) => void,
  immediate = true,
) {
  emitter.on(routerChangeKey, handler as Handler)
  if (immediate && latestRoute) {
    handler(latestRoute)
  }
}

export function removeRouteListener() {
  emitter.off(routerChangeKey)
}

// ------tab bar-------

let tabBarAction: Eaction

export const setTabBarEmitter = (v: Eaction) => {
  emitter.emit(tabActionMethodKey, v)
  tabBarAction = v
}

export function listenerTabBarAction(
  // eslint-disable-next-line no-unused-vars
  handler: (v: Eaction) => void,
  immediate = true,
) {
  emitter.on(tabActionMethodKey, handler as Handler)
  if (immediate && tabBarAction) {
    handler(tabBarAction)
  }
}

export function removeTabBarActionListener() {
  emitter.off(tabActionMethodKey)
}
