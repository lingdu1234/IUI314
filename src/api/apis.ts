/* eslint-disable no-unused-vars */
/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-09 14:49:24
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-09 15:37:23
 * @FilePath: \IUI314\src\api\apis.ts
 * @Description:
 */
/**
 * @description: 系统用户Api
 */
export enum SysUserApi {
  freshToken = '/system/user/fresh_token',
}

/**
 * @description: 系统登录Api
 */
export enum SysLoginApi {
  getCaptcha = '/comm/get_captcha',
  login = '/comm/login',
  getUserInfo = '/system/user/get_info',
  getRouters = '/system/menu/get_routers',
  logOut = '/comm/log_out',
}

/**
 * @description: 字典相关Api
 */
export enum SysDictApi {
  getDictDataByType = '/system/dict/data/get_by_type',
  getDictTypeList = '/system/dict/type/list',
}
