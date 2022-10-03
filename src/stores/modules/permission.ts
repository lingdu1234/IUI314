/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-03 21:21:23
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-03 23:24:31
 * @FilePath: \IUI314\src\stores\modules\permission.ts
 * @Description:
 */
import { defineStore } from 'pinia'

import { getUserRouters } from '@/api/login'
import { constantRoutes, InnerLink, Layout, ParentView } from '@/router'
import type { AppRouteRecordRaw, Component } from '@/types/base/router'

const views: Record<string, Component> = import.meta.glob('@/views/**/*.vue')

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    routes: new Array<AppRouteRecordRaw>(),
    addRoutes: new Array<AppRouteRecordRaw>(),
    defaultRoutes: new Array<AppRouteRecordRaw>(),
    sidebarRouters: new Array<AppRouteRecordRaw>(),
  }),
  actions: {
    setRoutes(routes: AppRouteRecordRaw[]) {
      this.addRoutes = routes
      this.routes = constantRoutes.concat(routes)
    },
    setDefaultRoutes(routes: AppRouteRecordRaw[]) {
      this.defaultRoutes = constantRoutes.concat(routes)
    },
    setSidebarRouters(routes: AppRouteRecordRaw[]) {
      this.sidebarRouters = routes
    },
    async generateRoutes() {
      const routes = await getUserRouters()
      const routers = filterAsyncRouter(routes)
      this.setSidebarRouters(constantRoutes.concat(routers))
      this.setDefaultRoutes(routers)
      this.setRoutes(routers)
      console.log('routers :>> ', routers)
      return routers
    },
  },
})

function filterAsyncRouter(asyncRouterMap: AppRouteRecordRaw[], type = false) {
  return asyncRouterMap.filter((route) => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.menu_type === 'M') {
      if (route.pid === '0') {
        route.component = 'Layout'
      } else {
        route.component = 'ParentView'
      }
    }

    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component == 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else if (route.component === 'InnerLink') {
        route.component = InnerLink
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}

const loadView = (view: string) => {
  let res = () => import('@/components/error/404.vue')
  for (const path in views) {
    const dir = path.split('views/')[1].split('.vue')[0]
    if (dir === view) {
      res = () => views[path]()
    }
  }
  return res
}

function filterChildren(childrenMap: AppRouteRecordRaw[]) {
  let children = new Array<AppRouteRecordRaw>()
  childrenMap.forEach((el) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView') {
        el.children.forEach((c) => {
          c.path = c.path ? el.path + '/' + c.path : c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children))
            return
          }
          children.push(c)
        })
        return
      }
    }
    children = children.concat(el)
  })
  return children
}
