<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-09-30 18:41:35
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-04 16:07:42
 * @FilePath: \IUI314\src\App.vue
 * @Description: 
-->
<template>
  <el-config-provider :locale="localeLang">
    <router-view />
  </el-config-provider>
</template>
<script lang="ts" setup name="app-main">
import en from 'element-plus/es/locale/lang/en'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { computed } from 'vue'

import { useAppStore } from '@/stores'

const appStore = useAppStore()
const localeLang = computed(() => (appStore.app.lang === 'zh-CN' ? zhCn : en))
</script>
