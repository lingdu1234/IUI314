<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-01 21:29:50
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-07 07:58:29
 * @FilePath: \IUI314\src\components\app\theme-change.vue
 * @Description: 
-->
<template>
  <div>
    <el-icon v-if="appStore.app.isDark" @click="nextColor()">
      <Moon />
    </el-icon>
    <el-icon v-else @click="nextColor()">
      <Sunny />
    </el-icon>
  </div>
</template>

<script lang="ts" setup name="theme-change">
import { Moon, Sunny } from '@element-plus/icons-vue'

import { useTheme } from '@/hooks'
import { useAppStore } from '@/stores'

const appStore = useAppStore()

const { nextColor, init_theme } = useTheme()

init_theme(appStore.app.theme)
</script>
