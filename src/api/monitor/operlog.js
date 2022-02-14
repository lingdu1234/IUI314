import request from '@/utils/request'

// 查询操作日志列表
export function listOperLog(query) {
  return request({
    url: '/system/oper_log/list',
    method: 'get',
    params: query
  })
}

// 删除操作日志
export function delOperlog(data) {
  return request({
    url: '/system/oper_log/delete',
    method: 'delete',
    data
  })
}

// 清空操作日志
export function cleanOperlog() {
  return request({
    url: '/system/oper_log/clean',
    method: 'delete'
  })
}
