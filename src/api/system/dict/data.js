import request from '@/utils/request'

// 查询字典数据列表
export function listData(query) {
  return request({
    url: '/system/dict/data/list',
    method: 'get',
    params: query
  })
}

// 查询字典数据详细
export function getData(params) {
  return request({
    url: '/system/dict/data/get_by_id',
    method: 'get',
    params
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: '/system/dict/data/get_by_type',
    method: 'get',
    params: dictType
  })
}

// 新增字典数据
export function addData(data) {
  return request({
    url: '/system/dict/data/add',
    method: 'post',
    data
  })
}

// 修改字典数据
export function updateData(data) {
  return request({
    url: '/system/dict/data/edit',
    method: 'put',
    data
  })
}

// 删除字典数据
export function delData(data) {
  return request({
    url: '/system/dict/data/delete',
    method: 'delete',
    data
  })
}
