/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-05 19:56:52
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-05 20:00:05
 * @FilePath: \IUI314\src\hooks\util\useUtils.ts
 * @Description:
 */
const opt = Object.prototype.toString

export function isString(obj: any): obj is string {
  return opt.call(obj) === '[object String]'
}
