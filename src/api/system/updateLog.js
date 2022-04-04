import request from '@/utils/request'


// 查询详细
export function getAllUpdateInfo() {
  return request({
    url: '/system/update_log/get_all',
    method: 'get'
  })
}

// 新增
export function addUpdateInfo(data) {
  return request({
    url: '/system/update_log/add',
    method: 'post',
    data: data
  })
}

// 修改
export function updateUpdateInfo(data) {
  return request({
    url: '/system/update_log/edit',
    method: 'put',
    data: data
  })
}

// 删除
export function delUpdateInfo(data) {
  return request({
    url: '/system/update_log/delete',
    method: 'delete',
    data
  })
}
