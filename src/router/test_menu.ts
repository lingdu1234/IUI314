import type { AppRouteRecordRaw } from '@/types/base/router';

const Layout = () => import('@/components/layout/index.vue');
const ParentView = () => import('@/components/layout/parent-view.vue');

export const testRoutes: AppRouteRecordRaw[] = [
  {
    path: '/test1A',
    name: 'test1A',
    redirect: 'test1',
    component: Layout,
    meta: { title: '测试1A', icon: 'dashboard' },
    children: [
      {
        path: '/test1',
        name: 'test1',
        component: () => import('@/views/test1.vue'),
      },
      {
        path: '/test2',
        name: 'test2',
        component: () => import('@/views/test1.vue'),
      },
    ],
  },
  {
    path: '/test3',
    name: 'test3',
    component: () => import('@/views/test1.vue'),
    meta: { title: '测试3', icon: 'dashboard' },
  },
  {
    path: '/test4',
    name: 'test4',
    redirect: 'test41',
    component: Layout,
    meta: { title: '测试3', icon: 'dashboard' },
    children: [
      // {
      //     path: "/test41",
      //     name: "test41",
      //     component: () => import("@/views/test1.vue"),
      // },
      {
        path: '/test42',
        name: 'test42',
        redirect: 'test421',
        component: ParentView,
        meta: { title: '测试3', icon: 'dashboard' },
        children: [
          {
            path: '/test421',
            name: 'test421',
            component: () => import('@/views/test1.vue'),
            meta: { title: '测试421', icon: 'dashboard' },
          },
          {
            path: '/test422',
            name: 'test422',
            component: () => import('@/views/test1.vue'),
            meta: { title: '测试422', icon: 'dashboard' },
          },
        ],
      },
    ],
  },
];
