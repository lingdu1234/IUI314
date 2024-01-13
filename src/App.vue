<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-09-30 18:41:35
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \iu314\src\App.vue
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
import { computed, watch } from 'vue'

import { useAppStore } from '@/stores'

import { useDynamicTitle, useSetVh } from './hooks'

const appStore = useAppStore()

const localeLang = computed(() => (appStore.app.lang === 'zh-CN' ? zhCn : en))

//  程序启动设置自定义Vh
useSetVh()

// 设置语言
watch(
  () => appStore.app.lang,
  () => {
    useDynamicTitle().setDynamicTitle()
  },
)
</script>
