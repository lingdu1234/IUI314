<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-05 10:37:49
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-07 13:43:22
 * @FilePath: \IUI314\src\components\layout\tab-bar\tag-bar-operation.vue
 * @Description: 
-->
<template>
  <div class="flex items-center justify-around tag-bar-operation">
    <el-icon
      class="cursor-pointer"
      @click="refesh"
      :class="isFreshing ? 'is-loading' : ''"
    >
      <RefreshLeft />
    </el-icon>
    <el-dropdown
      class="cursor-pointer"
      trigger="click"
      @command="actionchanged"
    >
      <el-icon color="var(--drop-down-icon-color)"><ArrowDownBold /></el-icon>
      <template #dropdown>
        <TabBarItemDropdown
          :item-data="currentRoute"
          :index="findCurrentRouteIndex()"
        />
      </template>
    </el-dropdown>
    <el-icon @click="appStore.toggleScreenOut" class="cursor-pointer">
      <SvgIcon :name="appStore.app.isScreenOut ? 'screen-out' : 'screen-in'" />
    </el-icon>
  </div>
</template>

<script lang="ts" setup name="tab-bar-operation">
import { ArrowDownBold, RefreshLeft } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import { setTabBarEmitter } from '@/hooks'
import { formatTag, useAppStore } from '@/stores'

import SvgIcon from '../../common/svg-icon.vue'
import TabBarItemDropdown from './tab-bar-item-dropdown.vue'
import { Eaction, useTabBar } from './useTabBar'

const { findCurrentRouteIndex } = useTabBar()
const route = useRoute()
const isFreshing = ref<boolean>(false)

const appStore = useAppStore()

const currentRoute = computed(() => formatTag(route))

const refesh = () => {
  isFreshing.value = true
  setTabBarEmitter(Eaction.reload)
  setTimeout(() => {
    isFreshing.value = false
  }, 2000)
}
const actionchanged = async (value: Eaction) => {
  setTabBarEmitter(value)
}
</script>

<style scoped lang="scss">
.tag-bar-operation {
  width: var(--tab-bar-operation-width);
}
</style>
