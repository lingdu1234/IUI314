import request from '@/utils/request'

// 查询岗位详细
export function getApiDb(query) {
  return request({
    url: '/system/api_db/get_by_id',
    method: 'get',
    params: query
  })
}

// 新增ApiDb
export function addEditApiDb(data) {
  return request({
    url: '/system/api_db/add',
    method: 'post',
    data: data
  })
}

