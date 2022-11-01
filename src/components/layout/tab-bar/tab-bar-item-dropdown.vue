<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-06 19:32:07
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-11-01 10:39:47
 * @FilePath: \IUI314\src\components\layout\tab-bar\tab-bar-item-dropdown.vue
 * @Description: 
-->
<template>
  <el-dropdown-menu>
    <el-dropdown-item :disabled="disabledReload" :command="Eaction.reload">
      <el-icon><Refresh /></el-icon>
      <span>{{ t('tab.refresh') }}</span>
    </el-dropdown-item>
    <el-dropdown-item :disabled="disabledCurrent" :command="Eaction.current">
      <el-icon><Close /></el-icon>
      <span>{{ t('tab.closeCurrentTab') }}</span>
    </el-dropdown-item>
    <el-dropdown-item :disabled="disabledLeft" :command="Eaction.left">
      <el-icon><ArrowLeft /></el-icon>
      <span>{{ t('tab.closeLeftTab') }}</span>
    </el-dropdown-item>
    <el-dropdown-item :disabled="disabledRight" :command="Eaction.right">
      <el-icon><ArrowRight /></el-icon>
      <span>{{ t('tab.closeRightTab') }}</span>
    </el-dropdown-item>
    <el-dropdown-item :command="Eaction.others">
      <el-icon><Switch /></el-icon>
      <span>{{ t('tab.closeOtherTab') }}</span>
    </el-dropdown-item>
    <el-dropdown-item :command="Eaction.all">
      <el-icon><Smoking /></el-icon>
      <span>{{ t('tab.closeAllTab') }}</span>
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
import { ElDropdownItem, ElDropdownMenu, ElIcon } from 'element-plus'
import { type PropType, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import type { MessageSchema } from '@/i18n'
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
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
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
