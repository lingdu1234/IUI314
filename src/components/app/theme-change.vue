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
