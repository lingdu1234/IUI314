import request from '@/utils/request'

// 查询字典类型列表
export function listType(query) {
  return request({
    url: '/system/dict/type/list',
    method: 'get',
    params: query
  })
}

// 查询字典类型详细
export function getType(params) {
  return request({
    url: '/system/dict/type/get_by_id',
    method: 'get',
    params
  })
}

// 新增字典类型
export function addType(data) {
  return request({
    url: '/system/dict/type/add',
    method: 'post',
    data: data
  })
}

// 修改字典类型
export function updateType(data) {
  return request({
    url: '/system/dict/type/edit',
    method: 'put',
    data
  })
}

// 删除字典类型
export function delType(data) {
  return request({
    url: '/system/dict/type/delete',
    method: 'delete',
    data
  })
}

// 刷新字典缓存
export function refreshCache() {
  return request({
    url: '/system/dict/type/refreshCache',
    method: 'delete'
  })
}

// 获取字典选择框列表
export function optionselect() {
  return request({
    url: '/system/dict/type/optionselect',
    method: 'get'
  })
}
