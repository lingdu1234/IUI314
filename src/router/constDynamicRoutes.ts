/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-15 08:00:22
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-16 13:16:30
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
}
