<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-06 19:32:07
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-07 13:59:34
 * @FilePath: \IUI314\src\components\layout\tab-bar\tab-bar-item-dropdown.vue
 * @Description: 
-->
<template>
  <el-dropdown-menu>
    <el-dropdown-item :disabled="disabledReload" :command="Eaction.reload">
      <el-icon><Refresh /></el-icon>
      <span>重新加载</span>
    </el-dropdown-item>
    <el-dropdown-item :disabled="disabledCurrent" :command="Eaction.current">
      <el-icon><Close /></el-icon>
      <span>关闭当前标签页</span>
    </el-dropdown-item>
    <el-dropdown-item :disabled="disabledLeft" :command="Eaction.left">
      <el-icon><ArrowLeft /></el-icon>
      <span>关闭左侧标签页</span>
    </el-dropdown-item>
    <el-dropdown-item :disabled="disabledRight" :command="Eaction.right">
      <el-icon><ArrowRight /></el-icon>
      <span>关闭右侧标签页</span>
    </el-dropdown-item>
    <el-dropdown-item :command="Eaction.others">
      <el-icon><Switch /></el-icon>
      <span>关闭其它标签页</span>
    </el-dropdown-item>
    <el-dropdown-item :command="Eaction.all">
      <el-icon><Smoking /></el-icon>
      <span>关闭全部标签页</span>
    </el-dropdown-item>
  </el-dropdown-menu>
</template>
<script lang="ts" setup name="tab-bar-item-dropdown">
import {
  ArrowLeft,
  ArrowRight,
  Close,
  Refresh,
  Smoking,
  Switch,
} from '@element-plus/icons-vue'
import { type PropType, computed } from 'vue'
import { useRoute } from 'vue-router'

import type { TagProps } from '@/types/base/router'

import { Eaction, useTabBar } from './useTabBar'
const props = defineProps({
  itemData: {
    type: Object as PropType<TagProps>,
    default() {
      return []
    },
  },
  index: {
    type: Number,
    default: 0,
  },
})
const route = useRoute()
const { tagList } = useTabBar()

const disabledReload = computed(
  () => props.itemData.fullPath !== route.fullPath
)

const disabledCurrent = computed(() => {
  return props.index === 0
})

const disabledLeft = computed(() => {
  return [0, 1].includes(props.index)
})

const disabledRight = computed(() => {
  return props.index === tagList.value.length - 1
})
</script>
