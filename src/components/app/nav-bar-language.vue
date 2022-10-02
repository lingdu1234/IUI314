<template>
  <div>
    <el-dropdown trigger="click">
      <el-icon size="large">
        <SvgIcon name="app-language" />
      </el-icon>
      <template #dropdown>
        <el-dropdown-item> 测试A </el-dropdown-item>
        <el-dropdown-item> 测试A </el-dropdown-item>
        <el-dropdown-item> 测试A </el-dropdown-item>
        <el-dropdown-item> 测试A </el-dropdown-item>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup name="nav-bar-language">
import SvgIcon from '@/components/common/svg-icon.vue'
</script>
