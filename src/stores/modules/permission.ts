/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-03 21:21:23
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-05 08:13:42
 * @FilePath: \IUI314\src\stores\modules\permission.ts
 * @Description:
 */
import { defineStore } from 'pinia'

import { getUserRouters } from '@/api/login'
import {
  constantRoutes,
  InnerLink,
  Layout,
  NotFoundRoutes,
  ParentView,
} from '@/router'
import type { AppRouteRecordRaw, Component } from '@/types/base/router'

const views: Record<string, Component> = import.meta.glob('@/views/**/*.vue')

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    routes: new Array<AppRouteRecordRaw>(),
    addRoutes: new Array<AppRouteRecordRaw>(),
    isReloading: true,
  }),
  actions: {
    setRoutes(routes: AppRouteRecordRaw[]) {
      this.addRoutes = routes
      this.routes = [...constantRoutes, ...routes, NotFoundRoutes]
    },
    async generateRoutes() {
      const routes = await getUserRouters()
      const routers = await filterAsyncRouter(routes)
      this.setRoutes(routers)
      return routers
    },
    setIsReloading(isReloading: boolean) {
      this.isReloading = isReloading
    },
  },
})

async function filterAsyncRouter(
  asyncRouterMap: AppRouteRecordRaw[],
  type = false
) {
  return asyncRouterMap.filter(async (route) => {
    if (type && route.children) {
      route.children = await filterChildren(route.children)
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
      route.children = await filterAsyncRouter(route.children, type)
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

async function filterChildren(childrenMap: AppRouteRecordRaw[]) {
  let children = new Array<AppRouteRecordRaw>()
  childrenMap.forEach((el) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView') {
        el.children.forEach(async (c) => {
          c.path = c.path ? el.path + '/' + c.path : c.path
          if (c.children && c.children.length) {
            children = children.concat(await filterChildren(c.children))
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
