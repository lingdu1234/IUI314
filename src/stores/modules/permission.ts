import { defineStore } from 'pinia'

import { unref } from 'vue'
import {
  InnerLink,
  Layout,
  NoPermissionRoute,
  NotFound,
  NotFoundRoute,
  ServerErrorRoute,
} from '@/router/constant'
import { constantRoutes } from '@/router/router'
import type { AppRouteRecordRaw, Component } from '@/types/base/router'
import { MenuType } from '@/types/base/router'
import { useGet } from '@/hooks'
import { ApiSysLogin } from '@/api/sysApis'

const views: Record<string, Component> = import.meta.glob('@/views/**/*.vue')

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    routes: new Array<AppRouteRecordRaw>(),
    addRoutes: new Array<AppRouteRecordRaw>(),
    isReloading: true,
    routeIsDone: false,
  }),
  getters: {
    getPermissionRoutes(): AppRouteRecordRaw[] {
      return this.routes
    },
  },
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
      const { data, execute } = useGet<AppRouteRecordRaw[]>(ApiSysLogin.getRouters)
      await execute()
      const routes = unref(data) as AppRouteRecordRaw[]
      // routers 生成正常的路由数据，用于菜单生成等
      // AccessRouters  将正常路由转换为二级扁平路由，用于keep-live和生成路由表
      const [routers, AccessRouters] = await Promise.all([
        filterAsyncRouter(routes),
        filterAsyncRouter(generateFlatRoutes(routes)),
      ])
      //  设置菜单路由
      this.setRoutes(routers)
      // 返回扁平路由
      return AccessRouters
      // return routers
    },
    setIsReloading(isReloading: boolean) {
      this.isReloading = isReloading
    },
    setRouteIsDone(v: boolean) {
      this.routeIsDone = v
    },
  },
})

async function filterAsyncRouter(
  asyncRouterMap: AppRouteRecordRaw[],
  type = true,
) {
  return asyncRouterMap.filter(async (route) => {
    if (type && route.children)
      route.children = await filterChildren(route.children)

    if (route.menu_type === MenuType.M && route.pid === '0')
      route.component = 'Layout'

    if (route.component) {
      if (route.component === 'Layout')
        route.component = Layout
      else if (route.component === 'InnerLink')
        route.component = InnerLink
      else
        route.component = loadView(route.component)
    }
    if (route.children && route.children.length > 0) {
      route.children = await filterAsyncRouter(route.children, type)
    }
    else {
      delete route.children
      delete route.redirect
    }
    return true
  })
}

function loadView(view: string) {
  let res = NotFound
  for (const path in views) {
    const dir = path.split('views/')[1].split('.vue')[0]
    if (dir === view)
      res = () => views[path]()
  }
  return res
}

async function filterChildren(childrenMap: AppRouteRecordRaw[]) {
  let children = new Array<AppRouteRecordRaw>()
  childrenMap.forEach((el) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView') {
        el.children.forEach(async (c) => {
          c.path = c.path ? `${el.path}/${c.path}` : c.path
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
  accessRoutes: AppRouteRecordRaw[],
): AppRouteRecordRaw[] {
  const flatRoutes: AppRouteRecordRaw[] = []

  for (const item of accessRoutes) {
    let childrenFlatRoutes: AppRouteRecordRaw[] = []
    const r = { ...item }

    if (item.children && item.children.length > 0)
      childrenFlatRoutes = castToFlatRoute(item.children, '')

    // 一级路由是布局路由,需要处理的只是其子路由数据
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
  flatRoutes: AppRouteRecordRaw[] = [],
): AppRouteRecordRaw[] {
  for (const item of routes) {
    if (item.children && item.children.length > 0) {
      if (item.redirect && item.redirect !== 'noRedirect') {
        const r = { ...item }
        r.path = (`${parentPath}/${item.path}`).substring(1)
        flatRoutes.push(r)
      }
      castToFlatRoute(item.children, `${parentPath}/${item.path}`, flatRoutes)
    }
    else {
      const r = { ...item }
      r.path = (`${parentPath}/${item.path}`).substring(1)
      flatRoutes.push(r)
    }
  }
  return flatRoutes
}
