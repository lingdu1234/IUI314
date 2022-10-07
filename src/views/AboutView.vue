<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-03 23:56:33
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-07 20:10:37
 * @FilePath: \IUI314\src\views\AboutView.vue
 * @Description: 字典类型数据
-->
<template>
  <div>
<div >ghfdhfddddddddddddddddddddddddddddddd</div>
    <div>{{count}}</div>
    <el-button  @click="()=>count++">+++</el-button>
  </div>
</template>
<script lang="ts" setup name="dict">
import { useDictsStore } from '@/stores'
import { ref } from 'vue';

const dictsStore = useDictsStore()

const count = ref(0)

const getDict = async () => {
  const data = await dictsStore.getDict('sys_normal_disable')
  console.log('data :>> ', data)
}
getDict()
</script>
