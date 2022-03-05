import request from '@/utils/request'

// 查询岗位列表
export function listData(query) {
  return request({
    url: '/test/data_scope/list',
    method: 'get',
    params: query
  })
}



// 新增岗位
export function addData(data) {
  return request({
    url: '/test/data_scope/add',
    method: 'post',
    data: data
  })
}



// 删除岗位
export function delData(data) {
  return request({
    url: '/test/data_scope/delete',
    method: 'delete',
    data
  })
}
