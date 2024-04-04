<script lang="ts" setup>
import enUS from '@arco-design/web-vue/es/locale/lang/en-us'
import zhCn from '@arco-design/web-vue/es/locale/lang/zh-cn'
import { computed, watch } from 'vue'

import { useDynamicTitle, useSetVh, useTheme } from './hooks'
import { useAppStore } from '@/stores'

defineOptions({ name: 'App' })

const appStore = useAppStore()

const localeLang = computed(() => (appStore.app.lang === 'zh-CN' ? zhCn : enUS))
//  程序启动设置自定义Vh
useSetVh()
// 设置主题

useTheme().init_theme()

// 设置语言
watch(
  () => appStore.app.lang,
  () => {
    useDynamicTitle().setDynamicTitle()
  },
)
</script>

<template>
  <a-config-provider :locale="localeLang" :size="appStore.app.size || 'small'">
    <router-view />
  </a-config-provider>
</template>
