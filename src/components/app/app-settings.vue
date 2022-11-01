<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-01 22:35:53
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-11-01 11:06:26
 * @FilePath: \IUI314\src\components\app\app-settings.vue
 * @Description: 
-->
<template>
  <div>
    <el-icon class="cursor-pointer">
      <SvgIcon
        name="app-settings"
        @click="appStore.setAppSettingDrawer(true)"
      />
    </el-icon>
  </div>
</template>

<script lang="ts" setup name="app-settings">
import { ElIcon } from 'element-plus'

import { useAppStore } from '@/stores'

import SvgIcon from '../common/svg-icon.vue'
const appStore = useAppStore()
</script>
