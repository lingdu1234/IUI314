<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-01 21:48:56
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-11-01 11:07:48
 * @FilePath: \IUI314\src\components\app\screen-full.vue
 * @Description: 
-->
<template>
  <div>
    <el-icon @click="appStore.toggleFullScreen" class="cursor-pointer">
      <SvgIcon
        :name="appStore.app.isFullscreen ? 'fullscreen-exit' : 'fullscreen'"
      />
    </el-icon>
  </div>
</template>

<script lang="ts" setup name="screen-full">
import { ElIcon } from 'element-plus'

import { useAppStore } from '@/stores'

import SvgIcon from '../common/svg-icon.vue'

const appStore = useAppStore()
</script>
