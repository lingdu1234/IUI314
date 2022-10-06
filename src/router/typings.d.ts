/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-05 20:12:27
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-06 06:47:35
 * @FilePath: \IUI314\src\router\typings.d.ts
 * @Description:
 */
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    roles?: string[] // Controls roles that have access to the page
    requiresAuth: boolean // Whether login is required to access the current page (every route must declare)
    icon?: string // The icon show in the side menu
    locale?: string // The locale name show in side menu and breadcrumb
    hideInMenu?: boolean // If true, it is not displayed in the side menu
    hideChildrenInMenu?: boolean // if set true, the children are not displayed in the side menu
    activeMenu?: string // if set name, the menu will be highlighted according to the name you set
    order?: number // Sort routing menu items. If set key, the higher the value, the more forward it is
    noAffix?: boolean // if set true, the tag will not affix in the tab-bar
    no_cache?: boolean // if set true, the page will not be cached
    title: string // The title
    link?: string // inner link
  }
}
