<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-02 11:04:09
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-04 13:31:21
 * @FilePath: \IUI314\src\components\layout\nav-bar\nav-bar-user.vue
 * @Description: 
-->
<!-- eslint-disable max-len -->
<template>
  <div>
    <el-dropdown trigger="click">
      <div class="avatar-wrapper">
        <img
          src="@/assets/av.webp"
          class="w-32px h-32px cursor-pointer b-rd-30px"
        />
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <router-link to="">
            <el-dropdown-item> 测试A </el-dropdown-item>
          </router-link>
          <router-link to="">
            <el-dropdown-item> 测试B </el-dropdown-item>
          </router-link>
          <router-link to="/user/profile">
            <el-dropdown-item divided> 个人中心 </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click="logout">
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup name="nav-bar-user">
import { ElMessageBox } from 'element-plus'

import { useUserStore } from '@/stores'

const userStore = useUserStore()
const logout = () => {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      userStore.logOut().then(() => {
        location.href = ''
      })
    })
    .catch(() => {})
}
</script>

<style scoped>
.router-link-active,
a {
  text-decoration: none;
}
</style>
