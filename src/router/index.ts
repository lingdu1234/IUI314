import type { App } from 'vue'
import {
  type RouteRecordRaw,
  createRouter,
  createWebHashHistory,
} from 'vue-router'

import type { AppRouteRecordRaw } from '@/types/base/router'

const Layout = () => import('@/components/layout/index.vue')
const ParentView = () => import('@/components/layout/parent-view.vue')

export const constantRoutes: AppRouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/components/layout/redirect/index.vue'),
      },
    ],
  },
  // 404
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/components/error/404.vue'),
    hidden: true,
  },
  // 401
  {
    path: '/401',
    component: () => import('@/components/error/401.vue'),
    hidden: true,
  },
  // login
  {
    path: '/login',
    component: () => import('@/components/login/index.vue'),
    hidden: true,
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
        name: 'index',
        meta: { title: '首页', icon: 'dashboard' },
      },
      {
        path: '/index2',
        component: () => import('@/views/test1.vue'),
        name: 'index2',
        meta: { title: '首页2', icon: 'dashboard' },
      },
    ],
  },
  {
    path: '/ceshi',
    component: Layout,
    redirect: 'ceishi1',
    name: 'ceishi',
    meta: { title: '测试', icon: 'dashboard' },
    children: [
      {
        path: 'ceshi1',
        component: () => import('@/views/AboutView.vue'),
        name: 'ceshi1',
        meta: { title: '首页', icon: 'dashboard' },
      },
      {
        path: 'ceshi2',
        component: () => import('@/views/test1.vue'),
        name: 'ceshi12',
        meta: { title: '首页2', icon: 'dashboard' },
      },
    ],
  },
  {
    path: '/test4',
    name: 'test4',
    redirect: 'test41',
    component: Layout,
    meta: { title: '测试3', icon: 'dashboard' },
    children: [
      {
        path: 'test42',
        name: 'test42',
        redirect: 'test421',
        component: ParentView,
        meta: { title: '测试42', icon: 'dashboard' },
        children: [
          {
            path: 'test421',
            name: 'test421',
            component: () => import('@/views/test1.vue'),
            meta: { title: '测试421', icon: 'dashboard' },
          },
          {
            path: 'test422',
            name: 'test422',
            component: () => import('@/views/test1.vue'),
            meta: { title: '测试422', icon: 'dashboard' },
          },
        ],
      },
    ],
  },
  {
    path: '/test41',
    name: 'test41',
    component: Layout,
    meta: { title: '测试41', icon: 'dashboard' },
    children: [
      {
        path: 'test45',
        name: 'test45',
        component: () => import('@/views/test1.vue'),
        meta: { title: '测试45', icon: 'dashboard' },
      },
    ],
  },
]

export const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [...constantRoutes] as Readonly<RouteRecordRaw[]>,
  scrollBehavior() {
    return { top: 0 }
  },
})

export const setupRoutes = (app: App) => {
  app.use(router)
}
