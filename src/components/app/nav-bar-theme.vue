<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-02 07:44:59
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-09 14:07:48
 * @FilePath: \IUI314\src\components\app\nav-bar-theme.vue
 * @Description: 
-->
<template>
  <div>
    <el-dropdown trigger="click">
      <el-icon size="large" color="var(--drop-down-icon-color)">
        <SvgIcon name="theme" />
      </el-icon>
      <template #dropdown>
        <el-dropdown-item
          v-for="theme in theme_list"
          :key="theme"
          @click="setTheme(theme)"
        >
          {{ theme_map[theme] }}
        </el-dropdown-item>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts" name="nav-bar-theme">
import { useTheme } from '@/hooks'

const { setTheme, theme_map, theme_list } = useTheme()
</script>
