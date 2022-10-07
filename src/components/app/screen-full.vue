<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-01 21:48:56
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-07 12:28:18
 * @FilePath: \IUI314\src\components\app\screen-full.vue
 * @Description: 
-->
<template>
  <div>
    <el-icon @click="appStore.toggleFullScreen">
      <SvgIcon
        :name="appStore.app.isFullscreen ? 'fullscreen-exit' : 'fullscreen'"
      />
    </el-icon>
  </div>
</template>

<script lang="ts" setup name="screen-full">
import { useAppStore } from '@/stores'

import SvgIcon from '../common/svg-icon.vue'

const appStore = useAppStore()
</script>
