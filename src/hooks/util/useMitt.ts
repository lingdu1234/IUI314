/**
 * Listening to routes alone would waste rendering performance.
 * Use the publish-subscribe model for distribution management
 * 单独监听路由会浪费渲染性能。使用发布订阅模式去进行分发管理。
 */
import mitt, { type Handler } from 'mitt'
import type { RouteLocationNormalized } from 'vue-router'

import type { TabAction } from '@/components/layout/tab-bar/useTabBar'

const emitter = mitt()

const routerChangeKey = Symbol('ROUTE_CHANGE')
const tabActionMethodKey = Symbol('TAB_ACTION_METHOD')

let latestRoute: RouteLocationNormalized

export function setRouteEmitter(to: RouteLocationNormalized) {
  emitter.emit(routerChangeKey, to)
  latestRoute = to
}

export function listenerRouteChange(

  handler: (route: RouteLocationNormalized) => void,
  immediate = true,
) {
  emitter.on(routerChangeKey, handler as Handler)
  if (immediate && latestRoute)
    handler(latestRoute)
}

export function removeRouteListener() {
  emitter.off(routerChangeKey)
}

// ------tab bar-------

let tabBarAction: TabAction

export function setTabBarEmitter(v: TabAction) {
  emitter.emit(tabActionMethodKey, v)
  tabBarAction = v
}

export function removeTabBarActionListener() {
  emitter.off(tabActionMethodKey)
}
