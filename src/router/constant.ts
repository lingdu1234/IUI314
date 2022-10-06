import type { AppRouteRecordRaw } from '@/types/base/router'

/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-06 16:05:22
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-06 16:09:07
 * @FilePath: \IUI314\src\router\constant.ts
 * @Description:
 */
export const Layout = () => import('@/components/layout/Layout.vue')
export const ParentView = () => import('@/components/layout/parent-view.vue')
export const InnerLink = () => import('@/components/layout/inner-link.vue')
export const NotFound = () => import('@/components/exception/404.vue')
export const NoPermission = () => import('@/components/exception/401.vue')
export const ServerError = () => import('@/components/exception/500.vue')

export const REDIRECT_ROUTE_NAME = 'redirect' //重定向
export const DEFAULT_ROUTE_NAME = 'dashboard' //首页
export const DEFAULT_ROUTE = {
  title: '首页',
  name: DEFAULT_ROUTE_NAME,
  Path: '/index',
  fullPath: '/index',
}

// NotFound  404
export const NotFoundRoutes: AppRouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: NotFound,
  hidden: true,
}

export const NoPermissionRoute: AppRouteRecordRaw = {
  path: '/401',
  component: NoPermission,
  name: '401',
  hidden: true,
}

export const ServerErrorRoute: AppRouteRecordRaw = {
  path: '/401',
  component: ServerError,
  name: '401',
  hidden: true,
}
