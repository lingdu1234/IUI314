import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";
import md5 from 'blueimp-md5';
// 查询用户列表
export function listUser(query) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getUser(query) {
  return request({
    url: '/system/user/get_by_id',
    method: 'get',
    params: query
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/system/user/add',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  data.user_password = md5(data.user_password);
  return request({
    url: '/system/user/edit',
    method: 'put',
    data: data
  })
}

// 删除用户打扰
export function delUser(data) {
  return request({
    url: '/system/user/delete',
    method: 'delete',
    data
  })
}

// 用户密码重置
export function resetUserPwd(user_id, new_passwd) {
  const data = {
    user_id,
    new_passwd:md5(new_passwd)
  }
  return request({
    url: '/system/user/reset_passwd',
    method: 'put',
    data
  })
}

// 用户状态修改
export function changeUserStatus(user_id, status) {
  const data = {
    user_id,
    status
  }
  return request({
    url: '/system/user/change_status',
    method: 'put',
    data: data
  })
}

// 切换用户角色
export function changeUserRole(user_id, role_id) {
  const data = {
    user_id,
    role_id
  }
  return request({
    url: '/system/user/change_role',
    method: 'put',
    data: data
  })
}
// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/system/user/get_profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/system/user/update_profile',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    old_passwd:md5(oldPassword),
    new_passwd:md5(newPassword)
  }
  return request({
    url: '/system/user/update_passwd',
    method: 'put',
    data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/system/user/update_avatar',
    method: 'post',
    data
  })
}

// 查询授权角色
// export function getAuthRole(userId) {
//   return request({
//     url: '/system/user/authRole/' + userId,
//     method: 'get'
//   })
// }

// 保存授权角色
export function updateAuthRole(data) {
  return request({
    url: '/system/role/update_auth_role',
    method: 'put',
    data
  })
}

// 刷新token
export function freshToken() {
  return request({
    url: '/system/user/fresh_token',
    method: 'put',
  })
}
