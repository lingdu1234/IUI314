<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-01 21:29:50
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-04 12:49:36
 * @FilePath: \IUI314\src\components\app\theme-change.vue
 * @Description: 
-->
<template>
  <div>
    <el-icon v-if="colorMode == 'dark'" @click="nextColor()">
      <Moon />
    </el-icon>
    <el-icon v-else @click="nextColor()">
      <Sunny />
    </el-icon>
  </div>
</template>

<script lang="ts" setup name="theme-change">
import { Moon, Sunny } from '@element-plus/icons-vue'

import { useTheme } from '@/hooks/app/useTheme'

const { colorMode, nextColor } = useTheme()
</script>
