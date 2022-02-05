import request from '@/utils/request'

// 查询定时任务调度列表
export function listJob (query) {
  return request({
    url: '/system/job/list',
    method: 'get',
    params: query
  })
}

// 查询定时任务调度详细
export function getJob (query) {
  return request({
    url: '/system/job/get_by_id',
    method: 'get',
    params: query
  })
}

// 新增定时任务调度
export function addJob (data) {
  return request({
    url: '/system/job/add',
    method: 'post',
    data: data
  })
}

// 修改定时任务调度
export function updateJob (data) {
  return request({
    url: '/system/job/edit',
    method: 'put',
    data: data
  })
}

// 删除定时任务调度
export function delJob (data) {
  return request({
    url: '/system/job/delete',
    method: 'delete',
    data
  })
}

// 任务状态修改
export function changeJobStatus (data) {
  return request({
    url: '/system/job/change_status',
    method: 'put',
    data: data
  })
}


// 定时任务立即执行一次
export function runJob (job_id,task_id) {
  const data = {job_id,task_id}
  return request({
    url: '/system/job/run_task_once',
    method: 'put',
    data: data
  })
}