/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-15 22:34:39
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\types\system\post.ts
 * @Description:
 */
import type { operateInfo, pageData, pageQueryParam } from '../base/apis'

export interface post extends operateInfo {
  post_id?: string
  post_code?: string
  post_name?: string
  post_sort?: number
  status?: string
  remark?: string
}

export interface postList extends pageData {
  list: post[]
}

export interface postQueryParam extends pageQueryParam {
  post_code?: string
  post_name?: string
  status?: string
}
