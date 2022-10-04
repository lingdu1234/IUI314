<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-02 07:44:59
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-04 12:49:25
 * @FilePath: \IUI314\src\components\app\nav-bar-language.vue
 * @Description: 
-->
<template>
  <div>
    <el-dropdown trigger="click">
      <el-icon size="large">
        <SvgIcon name="app-language" />
      </el-icon>
      <template #dropdown>
        <el-dropdown-item @click="setTheme('pink')"> 粉色 </el-dropdown-item>
        <el-dropdown-item @click="setTheme('classic')">
          classic
        </el-dropdown-item>
        <el-dropdown-item> 测试A </el-dropdown-item>
        <el-dropdown-item> 测试A </el-dropdown-item>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup name="nav-bar-language">
import SvgIcon from '@/components/common/svg-icon.vue'
import { useTheme } from '@/hooks/app/useTheme'
const { setTheme } = useTheme()
</script>
