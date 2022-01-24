import request from '@/utils/request'

// 查询岗位列表
export function listPost(query) {
  return request({
    url: '/system/post/list',
    method: 'get',
    params: query
  })
}

// 查询岗位详细
export function getPost(query) {
  return request({
    url: '/system/post/get_by_id',
    method: 'get',
    params: query
  })
}

// 新增岗位
export function addPost(data) {
  return request({
    url: '/system/post/add',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function updatePost(data) {
  return request({
    url: '/system/post/edit',
    method: 'put',
    data: data
  })
}

// 删除岗位
export function delPost(data) {
  return request({
    url: '/system/post/delete',
    method: 'delete',
    data
  })
}
