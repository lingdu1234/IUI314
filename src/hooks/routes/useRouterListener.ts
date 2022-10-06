/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-05 20:33:53
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-05 20:39:50
 * @FilePath: \IUI314\src\hooks\routes\useRouterListener.ts
 * @Description:
 */
/**
 * Listening to routes alone would waste rendering performance.
 * Use the publish-subscribe model for distribution management
 * 单独监听路由会浪费渲染性能。使用发布订阅模式去进行分发管理。
 */
import mitt, { type Handler } from 'mitt'
import type { RouteLocationNormalized } from 'vue-router'

const emitter = mitt()

const key = Symbol('ROUTE_CHANGE')

let latestRoute: RouteLocationNormalized

export function setRouteEmitter(to: RouteLocationNormalized) {
  emitter.emit(key, to)
  latestRoute = to
}

export function listenerRouteChange(
  // eslint-disable-next-line no-unused-vars
  handler: (route: RouteLocationNormalized) => void,
  immediate = true
) {
  emitter.on(key, handler as Handler)
  if (immediate && latestRoute) {
    handler(latestRoute)
  }
}

export function removeRouteListener() {
  emitter.off(key)
}
