import type { AppRouteRecordRaw, TagProps } from '@/types/base/router'

export const Layout = () => import('@/components/layout/Layout.vue')
export const InnerLink = () => import('@/components/layout/inner-link.vue')
export const NotFound = () => import('@/components/exception/404.vue')
export const NoPermission = () => import('@/components/exception/403.vue')
export const ServerError = () => import('@/components/exception/500.vue')

export const REDIRECT_ROUTE_NAME = 'redirect' // 重定向
export const DEFAULT_ROUTE_NAME = 'dashboard' // 首页
export const DictDataRouteName = 'DictData' // 字典数据
export const ApiManageRouteName = 'ApiManage' // 字典数据
export const ScheduledTasksLogRouteName = 'scheduled_tasks_log' // 定时任务日志
export const UserProfileRouteName = 'user_profile' // 用户中心

export const DEFAULT_ROUTE: TagProps = {
  title: '首页',
  name: DEFAULT_ROUTE_NAME,
  path: '/index',
  fullPath: '/index',
  i18n: 'home',
}

// NotFound  404
export const NotFoundRoute: AppRouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: NotFound,
  hidden: true,
}

export const ErrorPageRoute: AppRouteRecordRaw = {
  path: '/error',
  component: Layout,
  hidden: true,
  children: [
    {
      path: '/403',
      component: NoPermission,
      name: '403',
      meta: {
        title: '403',
      },
      hidden: true,
    },
    {
      path: '/500',
      component: ServerError,
      name: '401',
      hidden: true,
    },
  ],

}

export const DictDataRoute: AppRouteRecordRaw = {
  path: '/system/dict',
  component: Layout,
  hidden: true,
  children: [
    {
      path: 'data',
      component: () => import('@/views/system/dict/data.vue'),
      name: DictDataRouteName,
      meta: {
        title: '字典数据',
        activeMenu: '/system/basic/dict',
        no_cache: true,
        icon: 'dict',
        i18n: 'dictData',
      },
    },
  ],
}
export const ApiManageRoute: AppRouteRecordRaw = {
  path: '/system/menu',
  component: Layout,
  hidden: true,
  children: [
    {
      path: 'api',
      component: () => import('@/views/system/menu/api-manage.vue'),
      name: ApiManageRouteName,
      meta: {
        title: 'Api管理',
        activeMenu: '/system/basic/menu-manage',
        no_cache: false,
        icon: 'dict',
      },
    },
  ],
}
export const ScheduledTasksLogRoute: AppRouteRecordRaw = {
  path: '/monitor',
  component: Layout,
  hidden: true,
  children: [
    {
      path: 'log',
      component: () =>
        import('@/views/system/monitor/pages/scheduled-tasks-log.vue'),
      name: ScheduledTasksLogRouteName,
      meta: {
        title: '任务日志',
        activeMenu: '/monitor/scheduled-tasks',
        no_cache: true,
        icon: 'dict',
        i18n: 'taskLog',
      },
    },
  ],
}
export const UserProfileRoute: AppRouteRecordRaw = {
  path: '/user',
  component: Layout,
  hidden: true,
  children: [
    {
      path: 'profile',
      component: () => import('@/views/system/user/profile.vue'),
      name: UserProfileRouteName,
      meta: {
        title: '用户中心',
        no_cache: true,
        icon: 'user',
        i18n: 'userCenter',
      },
    },
  ],
}

// 导出所有固定路由
export const FixedRoutes = [
  DictDataRoute,
  ApiManageRoute,
  ScheduledTasksLogRoute,
  UserProfileRoute,
]
