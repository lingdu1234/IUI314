/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-03 07:00:13
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\types\base\apis.ts
 * @Description:  通用 interface
 */
export interface responseData {
  code: number
  data: any | null
  msg: string
}

export interface pageQueryParam {
  page_num?: number
  page_size?: number
  begin_time?: string
  end_time?: string
}

export interface pageData {
  page_num?: number
  total?: number
  total_pages?: number
}

export interface operateInfo {
  create_by?: string
  update_by?: string
  delete_by?: string
  created_at?: string
  updated_at?: string
  deleted_at?: string
}
