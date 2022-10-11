/* eslint-disable no-unused-vars */
/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-09 14:49:24
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-11 20:52:08
 * @FilePath: \IUI314\src\api\apis.ts
 * @Description:
 */

export type APIS = ApiSysLogin | ApiSysUser | ApiSysDictType | ApiSysDictData

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
  freshToken = '/system/user/fresh_token',
}

/**
 * @description: 字典类型Api
 */
export enum ApiSysDictType {
  // dict type
  getById = '/system/dict/type/get_by_id',
  getList = '/system/dict/type/list',
  eidt = '/system/dict/type/edit',
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
  eidt = '/system/dict/data/edit',
  add = '/system/dict/data/add',
  delete = '/system/dict/data/delete',
}
