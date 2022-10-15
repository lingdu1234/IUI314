/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-15 08:00:22
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-15 09:02:18
 * @FilePath: \IUI314\src\router\constdynamicRoutes.ts
 * @Description:  菜单路由命名管理
 */

export interface routeMenu {
  path: string
  name: string
}

export const systemMenus: Record<string, routeMenu> = {
  dict: {
    path: 'dict',
    name: '字典管理',
  },
  menu: {
    path: 'menu-manage',
    name: '菜单管理',
  },
}
