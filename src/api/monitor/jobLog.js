import request from '@/utils/request'

// 查询调度日志列表
export function listJobLog(query) {
  return request({
    url: '/system/job_log/list',
    method: 'get',
    params: query
  })
}

// 删除调度日志
export function delJobLog(data) {
  return request({
    url: '/system/job_log/delete',
    method: 'delete',
    data
  })
}

// 清空调度日志
export function cleanJobLog(data) {
  return request({
    url: '/system/job_log/clean',
    method: 'delete',
    data
  })
}
