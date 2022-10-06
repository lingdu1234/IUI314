/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-09-30 18:41:35
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-06 16:16:33
 * @FilePath: \IUI314\src\router\router.ts
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

import { InnerLink, Layout, REDIRECT_ROUTE_NAME } from './constant'

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
