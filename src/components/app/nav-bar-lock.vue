<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-01 22:26:33
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-11-04 21:52:26
 * @FilePath: \IUI314\src\components\app\nav-bar-lock.vue
 * @Description: 
-->
<template>
  <div>
    <el-icon class="cursor-pointer" @click="appStore.setIsLocked(true)">
      <Unlock />
    </el-icon>
  </div>
</template>

<script lang="ts" setup name="nav-bar-lock">
import { Unlock } from '@element-plus/icons-vue'
import { useIdle } from '@vueuse/core'
import { ElIcon } from 'element-plus'
import { watch } from 'vue'

import { useAppStore } from '@/stores'
const appStore = useAppStore()
const { idle } = useIdle(appStore.app.LockedTime)
watch(
  () => idle.value,
  (val) => {
    if (val) {
      // 监控是否无活动,无活动锁屏
      appStore.setIsLocked(true)
    }
  }
)
</script>
