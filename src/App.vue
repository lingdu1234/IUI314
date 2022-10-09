<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-09-30 18:41:35
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-09 14:04:12
 * @FilePath: \IUI314\src\App.vue
 * @Description: 
-->
<template>
  <el-config-provider :locale="localeLang" :size="appStore.app.size">
    <router-view />
  </el-config-provider>
</template>
<script lang="ts" name="app" setup>
import { ElConfigProvider } from 'element-plus'
import en from 'element-plus/es/locale/lang/en'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { computed } from 'vue'

import { useAppStore } from '@/stores'

const appStore = useAppStore()
const localeLang = computed(() => (appStore.app.lang === 'zh-CN' ? zhCn : en))
</script>
