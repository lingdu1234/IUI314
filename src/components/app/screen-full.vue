<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-01 21:48:56
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\components\app\screen-full.vue
 * @Description: 
-->
<template>
  <div>
    <el-icon class="cursor-pointer" @click="appStore.toggleFullScreen">
      <SvgIcon
        :name="appStore.app.isFullscreen ? 'fullscreen-exit' : 'fullscreen'"
      />
    </el-icon>
  </div>
</template>

<script lang="ts" name="screen-full" setup>
import { ElIcon } from 'element-plus'

import { useAppStore } from '@/stores'

import SvgIcon from '../common/svg-icon.vue'

const appStore = useAppStore()
</script>
