<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-03 23:56:33
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-08 16:37:23
 * @FilePath: \IUI314\src\views\system\dict\index.vue
 * @Description: 字典类型数据
-->
<template>
  <div>
    <div>{{ dict }}</div>
    <div>{{ count }}</div>
    <el-button @click="() => count++">+++</el-button>
  </div>
</template>
<script lang="ts" setup name="dict">
import { ref } from 'vue'

import { useDicts } from '@/hooks'

const count = ref(0)

const dict = useDicts('sys_normal_disable', 'db')
</script>
