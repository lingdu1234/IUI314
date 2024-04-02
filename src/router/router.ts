import type { App } from 'vue'
import {
  type RouteRecordRaw,
  createRouter,
  createWebHashHistory,
} from 'vue-router'

import { FixedRoutes, InnerLink, Layout, REDIRECT_ROUTE_NAME } from './constant'
import { useRouterGuard } from '@/hooks'
import type { AppRouteRecordRaw } from '@/types/base/router'

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
        component: () => import('@/components/layout/redirect.vue'),
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
    meta: { title: '首页', icon: 'dashboard', i18n: 'home' },
    children: [
      {
        path: '/index',
        component: () => import('@/views/AboutView.vue'),
        name: 'dashboard',
        meta: { title: '首页', icon: 'dashboard', i18n: 'home' },
      },
      {
        path: 'vue',
        component: InnerLink,
        name: 'vue',
        meta: {
          title: 'vue',
          icon: 'dashboard',
          link: 'https://cn.vuejs.org/',
          i18n: 'vue',
        },
      },
    ],
  },
]

export const router = createRouter({
  // history: createWebHistory(),
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [...constantRoutes, ...FixedRoutes] as Readonly<RouteRecordRaw[]>,
  scrollBehavior() {
    return { top: 0 }
  },
})

export async function setupRoutes(app: App) {
  app.use(router)
  await useRouterGuard(router)
  await router.isReady()
}
