/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-09-30 18:41:35
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-06 06:45:59
 * @FilePath: \IUI314\src\router\index.ts
 * @Description:
 */
import type { App } from 'vue'
import {
  type RouteRecordRaw,
  createRouter,
  createWebHashHistory,
} from 'vue-router'

import { useRouterGuard } from '@/hooks/routes/useRouteGuard'
import type { AppRouteRecordRaw } from '@/types/base/router'

export const Layout = () => import('@/components/layout/Layout.vue')
export const ParentView = () => import('@/components/layout/parent-view.vue')
export const InnerLink = () => import('@/components/layout/inner-link.vue')

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
  component: () => import('@/components/error/404.vue'),
  hidden: true,
}

//  固定路由
export const constantRoutes: AppRouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    name: REDIRECT_ROUTE_NAME,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/components/layout/redirect/index.vue'),
      },
    ],
  },
  // login
  {
    path: '/login',
    component: () => import('@/components/login/index.vue'),
    hidden: true,
    name: 'Login',
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    name: 'index',
    meta: { title: '首页', icon: 'dashboard' },
    children: [
      {
        path: '/index',
        component: () => import('@/views/AboutView.vue'),
        name: 'dashboard',
        meta: { title: '首页', icon: 'dashboard' },
      },
      {
        path: 'baidu',
        component: InnerLink,
        name: 'baidu',
        meta: {
          title: '百度',
          icon: 'dashboard',
          link: 'https://cn.vuejs.org/',
        },
      },
    ],
  },
  // 401
  {
    path: '/401',
    component: () => import('@/components/error/401.vue'),
    name: '401',
    hidden: true,
  },
]

export const router = createRouter({
  // history: createWebHistory(),
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [...constantRoutes] as Readonly<RouteRecordRaw[]>,
  scrollBehavior() {
    return { top: 0 }
  },
})

export const setupRoutes = async (app: App) => {
  app.use(router)
  await useRouterGuard(router)
  await router.isReady()
}
