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
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup name="nav-bar-user">
// import { useAppStore } from '@/stores'

// const appStore = useAppStore()
</script>

<style scoped>
.router-link-active,
a {
  text-decoration: none;
}
</style>
