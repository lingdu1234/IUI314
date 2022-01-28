import request from '@/utils/request'

// 查询角色列表
export function listRole(query) {
  return request({
    url: '/system/role/list',
    method: 'get',
    params: query
  })
}

// 查询角色详细
export function getRole(query) {
  return request({
    url: '/system/role/get_by_id',
    method: 'get',
    params: query
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/system/role/add',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: '/system/role/edit',
    method: 'put',
    data: data
  })
}

// 角色数据权限
export function dataScope(data) {
  return request({
    url: '/system/role/set_data_scope',
    method: 'put',
    data: data
  })
}

// 角色状态修改
export function changeRoleStatus(role_id, status) {
  const data = {
    role_id,
    status
  }
  return request({
    url: '/system/role/change_status',
    method: 'put',
    data
  })
}

// 删除角色
export function delRole(data) {
  return request({
    url: '/system/role/delete',
    method: 'delete',
    data
  })
}

// 查询角色已授权用户列表
export function allocatedUserList(query) {
  return request({
    url: '/system/role/get_auth_users_by_role_id',
    method: 'get',
    params: query
  })
}

// 查询角色未授权用户列表
export function unallocatedUserList(query) {
  return request({
    url: '/system/role/get_un_auth_users_by_role_id',
    method: 'get',
    params: query
  })
}

// 取消用户授权角色 / 批量
export function authUserCancel(data) {
  return request({
    url: '/system/role/cancel_auth_user',
    method: 'put',
    data: data
  })
}



// 授权用户选择
export function authUserSelectAll(data) {
  return request({
    url: '/system/role/add_auth_user',
    method: 'put',
    data
  })
}


// 获取角色的菜单权限
export function getRoleMenus(query) {
  return request({
    url: '/system/role/get_role_menu',
    method: 'get',
    params: query
  })
}

// 获取角色的部门权限
export function getRoleDepts(query) {
  return request({
    url: '/system/role/get_role_dept',
    method: 'get',
    params: query
  })
}