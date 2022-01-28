import request from '@/utils/request'

// 查询部门列表
export function listDept(query) {
  return request({
    url: '/system/dept/list',
    method: 'get',
    params: query
  })
}

// 查询部门列表（排除节点）
// export function listDeptExcludeChild(deptId) {
//   return request({
//     url: '/system/dept/list/exclude/' + deptId,
//     method: 'get'
//   })
// }

// 查询部门详细
export function getDept(query) {
  return request({
    url: '/system/dept/get_by_id',
    method: 'get',
    params: query
  })
}

// 查询部门下拉树结构
export function treeselect() {
  return request({
    url: '/system/dept/get_dept_tree',
    method: 'get'
  })
}

// 根据角色ID查询部门树结构
// export function roleDeptTreeselect(roleId) {
//   return request({
//     url: '/system/dept/roleDeptTreeselect/' + roleId,
//     method: 'get'
//   })
// }

// 新增部门
export function addDept(data) {
  return request({
    url: '/system/dept/add',
    method: 'post',
    data: data
  })
}

// 修改部门
export function updateDept(data) {
  return request({
    url: '/system/dept/edit',
    method: 'put',
    data: data
  })
}

// 删除部门
export function delDept(data) {
  return request({
    url: '/system/dept/delete',
    method: 'delete',
    data
  })
}