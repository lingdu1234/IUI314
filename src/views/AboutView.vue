<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-03 23:56:33
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-21 20:58:09
 * @FilePath: \IUI314\src\views\AboutView.vue
 * @Description: 字典类型数据
-->
<template>
  <div>
    <div>{{ t('hello') }}</div>
    <div>{{ count }}</div>
    <div>
      <el-button @click="() => count++">+++</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup name="aboutabout">
import { ref } from 'vue'

import { useSetupI18n } from '@/i18n'

const { i18n } = useSetupI18n()
const { t } = i18n.global

const count = ref(0)
</script>
