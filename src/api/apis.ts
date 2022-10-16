/* eslint-disable no-unused-vars */
/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-09 14:49:24
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-16 20:34:15
 * @FilePath: \IUI314\src\api\apis.ts
 * @Description:
 */

export const ErrorFlag = '__________'

export type APIS =
  | ApiSysLogin
  | ApiSysUser
  | ApiSysDictType
  | ApiSysDictData
  | ApiSysMenu
  | ApiSysDbApi
  | ApiSysDept
  | ApiSysPost
  | ApiSysRole

/**
 * @description: 系统登录Api
 */
export enum ApiSysLogin {
  getCaptcha = '/comm/get_captcha',
  login = '/comm/login',
  getUserInfo = '/system/user/get_info',
  getRouters = '/system/menu/get_routers',
  logOut = '/comm/log_out',
}

/**
 * @description: 系统用户Api
 */
export enum ApiSysUser {
  freshToken = '/system/user/fresh_token', //刷新token
  getList = '/system/user/list',
  getById = '/system/user/get_by_id',
  getProfile = '/system/user/get_profile',
  add = '/system/user/add',
  edit = '/system/user/edit',
  delete = '/system/user/delete',
  resetPwd = '/system/user/reset_passwd',
  /**
   * put
   */
  changeStatus = '/system/user/change_status',
  changeRole = '/system/user/change_role',
  changeDept = '/system/user/change_dept',
  updateProfile = '/system/user/update_profile',
  updatePwd = '/system/user/update_passwd',
  updateAvatar = '/system/user/update_avatar',
  updateAuthRole = '/system/role/update_auth_role',
}

/**
 * @description: 字典类型Api
 */
export enum ApiSysDictType {
  // dict type
  getById = '/system/dict/type/get_by_id',
  getList = '/system/dict/type/list',
  edit = '/system/dict/type/edit',
  add = '/system/dict/type/add',
  delete = '/system/dict/type/delete',
}
/**
@description: 字典数据Api
 */
export enum ApiSysDictData {
  getByType = '/system/dict/data/get_by_type',
  getById = '/system/dict/data/get_by_id',
  getList = '/system/dict/data/list',
  edit = '/system/dict/data/edit',
  add = '/system/dict/data/add',
  delete = '/system/dict/data/delete',
}

export enum ApiSysMenu {
  getList = '/system/menu/list',
  getAuthList = '/system/menu/get_auth_list',
  // getTree = '/system/menu/get_menu_tree',
  getById = '/system/menu/get_by_id',
  getEnabledTree = '/system/menu/get_all_enabled_menu_tree',
  add = '/system/menu/add',
  edit = '/system/menu/edit',
  delete = '/system/menu/delete',
  updateLogCache = '/system/menu/update_log_cache_method',
}

/**
 * 数据库关联修改api
 */
export enum ApiSysDbApi {
  // getById = '/system/api_db/get_by_id',
  edit = '/system/api_db/add', //编辑和添加为同一api  post
}

/**
 * department api
 */
export enum ApiSysDept {
  getList = '/system/dept/list',
  getById = '/system/dept/get_by_id',
  getDeptTree = '/system/dept/get_dept_tree',
  add = '/system/dept/add',
  edit = '/system/dept/edit',
  delete = '/system/dept/delete',
}

/**
 * post api
 */
export enum ApiSysPost {
  getList = '/system/post/list',
  getById = '/system/post/get_by_id',
  add = '/system/post/add',
  edit = '/system/post/edit',
  delete = '/system/post/delete',
}

/**
 * role api
 */
export enum ApiSysRole {
  getList = '/system/role/list',
  getById = '/system/role/get_by_id',
  add = '/system/role/add',
  edit = '/system/role/edit',
  delete = '/system/role/delete',
  setDataScope = '/system/role/set_data_scope',
  changeStatus = '/system/role/change_status',
  getAuthUser = '/system/role/get_auth_users_by_role_id',
  getNoAuthUser = '/system/role/get_un_auth_users_by_role_id',
  cancelAuthUser = '/system/role/cancel_auth_user',
  authUser = '/system/role/add_auth_user',
  getRoleMenus = '/system/role/get_role_menu',
  getRoleDepts = '/system/role/get_role_dept',
}
