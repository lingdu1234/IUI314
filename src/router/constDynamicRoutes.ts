/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-15 08:00:22
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\router\constDynamicRoutes.ts
 * @Description:  菜单路由命名管理
 */

export interface routeMenuInfo {
  path: string
  name: string
}

export const systemMenus: Record<string, routeMenuInfo> = {
  dict: {
    path: 'dict',
    name: '字典管理',
  },
  menu: {
    path: 'menu-manage',
    name: '菜单管理',
  },
  menuV2: {
    path: 'menu-manage-v2',
    name: '菜单管理V2',
  },
  menu_auth: {
    path: 'auth_list',
    name: '权限查询',
  },
  userManage: {
    path: 'user-manage',
    name: '用户管理',
  },
  deptManage: {
    path: 'dept-manage',
    name: '部门管理',
  },
  postManage: {
    path: 'post-manage',
    name: '岗位管理',
  },
  roleManage: {
    path: 'role-manage',
    name: '角色管理',
  },
  loginLog: {
    path: 'login-log',
    name: '登录日志',
  },
  operateLog: {
    path: 'operate-log',
    name: '操作日志',
  },
  onlineUser: {
    path: 'online-user',
    name: '操作日志',
  },
  scheduledTasks: {
    path: 'scheduled-tasks',
    name: '定时任务',
  },
  serverMonitor: {
    path: 'server-monitor',
    name: '服务监控',
  },
}
