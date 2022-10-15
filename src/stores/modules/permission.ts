/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-03 21:21:23
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-15 07:59:34
 * @FilePath: \IUI314\src\stores\modules\permission.ts
 * @Description:
 */
import { defineStore } from 'pinia'

import { getUserRouters } from '@/api/system/login'
import {
  InnerLink,
  Layout,
  NoPermissionRoute,
  NotFound,
  NotFoundRoute,
  ParentView,
  ServerErrorRoute,
} from '@/router/constant'
import { constantRoutes } from '@/router/router'
import type { AppRouteRecordRaw, Component } from '@/types/base/router'
import { MenuType } from '@/types/base/router'

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
      this.routes = [
        ...constantRoutes,
        ...routes,
        NotFoundRoute,
        NoPermissionRoute,
        ServerErrorRoute,
      ]
    },
    async generateRoutes() {
      const routes = await getUserRouters()
      // routers 生成正常的路由数据，用于菜单生成等
      // AccessRouters  将正常路由转换为二级扁平路由，用于keep-live和生成路由表
      const [routers, AccessRouters] = await Promise.all([
        filterAsyncRouter(routes),
        filterAsyncRouter(generateFlatRoutes(routes)),
      ])
      //  设置菜单路由
      this.setRoutes(routers)
      //返回扁平路由
      return AccessRouters
    },
    setIsReloading(isReloading: boolean) {
      this.isReloading = isReloading
    },
  },
})

async function filterAsyncRouter(
  asyncRouterMap: AppRouteRecordRaw[],
  type = true
) {
  return asyncRouterMap.filter(async (route) => {
    if (type && route.children) {
      route.children = await filterChildren(route.children)
    }
    if (route.menu_type === MenuType.M) {
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
  let res = NotFound
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

/**
 * vue router 无法keep-live 三级及其以上的路由数据  需要将路由数据拍平成两级
 * @param {AppRouteRecordRaw[]} accessRoutes
 * @return {AppRouteRecordRaw[]}  flatRoutes
 */
function generateFlatRoutes(
  accessRoutes: AppRouteRecordRaw[]
): AppRouteRecordRaw[] {
  const flatRoutes: AppRouteRecordRaw[] = []

  for (const item of accessRoutes) {
    let childrenFlatRoutes: AppRouteRecordRaw[] = []
    if (item.children && item.children.length > 0) {
      childrenFlatRoutes = castToFlatRoute(item.children, '')
    }
    // 一级路由是布局路由,需要处理的只是其子路由数据
    const r = { ...item }
    r.children = childrenFlatRoutes
    flatRoutes.push(r)
  }

  return flatRoutes
}

/**
 * 将子路由转换为扁平化路由数组（仅一级）
 * @param {AppRouteRecordRaw[]} routes
 * @param {string} parentPath
 * @param flatRoutes
 */
function castToFlatRoute(
  routes: AppRouteRecordRaw[],
  parentPath: string,
  flatRoutes: AppRouteRecordRaw[] = []
): AppRouteRecordRaw[] {
  for (const item of routes) {
    if (item.children && item.children.length > 0) {
      if (item.redirect && item.redirect !== 'noRedirect') {
        const r = { ...item }
        r.path = (parentPath + '/' + item.path).substring(1)
        flatRoutes.push(r)
      }
      castToFlatRoute(item.children, parentPath + '/' + item.path, flatRoutes)
    } else {
      const r = { ...item }
      r.path = (parentPath + '/' + item.path).substring(1)
      flatRoutes.push(r)
    }
  }
  return flatRoutes
}
