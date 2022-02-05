import request from '@/utils/request'

// 查询登录日志列表
export function list(query) {
  return request({
    url: '/system/login-log/list',
    method: 'get',
    params: query
  })
}

// 删除登录日志
export function delLogininfor(data) {
  return request({
    url: '/system/login-log/delete',
    method: 'delete',
    data
  })
}

// 清空登录日志
export function cleanLogininfor() {
  return request({
    url: '/system/login-log/clean',
    method: 'delete'
  })
}
