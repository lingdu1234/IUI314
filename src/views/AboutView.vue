<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-03 23:56:33
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-08 18:49:05
 * @FilePath: \IUI314\src\views\AboutView.vue
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
import { useDictsStore } from '@/stores'
import { dictKey } from '@/types/system/dict'

const dictsStore = useDictsStore()

const count = ref(0)

const getDict = async () => {
  const data = await dictsStore.getDict(dictKey.sysNormalDisable)
  console.log('data :>> ', data)
}

const dict = useDicts('db')

getDict()
</script>
