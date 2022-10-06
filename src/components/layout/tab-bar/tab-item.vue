<!-- eslint-disable no-unused-vars -->
<template>
  <el-dropdown trigger="contextmenu" @command="actionSelect">
    <div class="flex items-center">
      <span
        class="tag-tab-item"
        :class="{ 'link-activated': itemData.fullPath === $route.fullPath }"
        @click="goto(itemData)"
      >
        <span class="tag-link">
          {{ itemData.title }}
        </span>
        <span class="m-l-10px" @click.stop="tagClose(itemData, index)">
          <el-icon><Close /></el-icon>
        </span>
      </span>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :disabled="disabledReload" :command="Eaction.reload">
          <el-icon><Refresh /></el-icon>
          <span>重新加载</span>
        </el-dropdown-item>
        <el-dropdown-item
          :disabled="disabledCurrent"
          :command="Eaction.current"
        >
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
  </el-dropdown>
</template>

<script lang="ts" setup>
import {
  ArrowLeft,
  ArrowRight,
  Close,
  Refresh,
  Smoking,
  Switch,
} from '@element-plus/icons-vue'
import { type PropType, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { DEFAULT_ROUTE_NAME } from '@/router'
import { useTabBarStore } from '@/stores'
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

const { tagList, goto, findCurrentRouteIndex } = useTabBar()

const router = useRouter()
const route = useRoute()
const tabBarStore = useTabBarStore()

const disabledReload = computed(() => {
  return props.itemData.fullPath !== route.fullPath
})

const disabledCurrent = computed(() => {
  return props.index === 0
})

const disabledLeft = computed(() => {
  return [0, 1].includes(props.index)
})

const disabledRight = computed(() => {
  return props.index === tagList.value.length - 1
})

const tagClose = (tag: TagProps, idx: number) => {
  tabBarStore.deleteTag(idx, tag)
  if (props.itemData.fullPath === route.fullPath) {
    const latest = tagList.value[idx - 1] // 获取队列的前一个tab
    if (latest && latest.name) {
      router.push({ name: latest.name })
    } else {
      tabBarStore.resetTabList()
      router.push({ name: DEFAULT_ROUTE_NAME })
    }
  }
}

const actionSelect = async (value: any) => {
  const { itemData, index } = props
  const copyTagList = [...tagList.value]
  if (value === Eaction.current) {
    tagClose(itemData, index)
  } else if (value === Eaction.left) {
    const currentRouteIdx = findCurrentRouteIndex()
    copyTagList.splice(1, props.index - 1)

    tabBarStore.freshTabList(copyTagList)
    if (currentRouteIdx < index) {
      router.push({ name: itemData.name })
    }
  } else if (value === Eaction.right) {
    const currentRouteIdx = findCurrentRouteIndex()
    copyTagList.splice(props.index + 1)

    tabBarStore.freshTabList(copyTagList)
    if (currentRouteIdx > index) {
      router.push({ name: itemData.name })
    }
  } else if (value === Eaction.others) {
    const filterList = tagList.value.filter((el, idx) => {
      return idx === 0 || idx === props.index
    })
    tabBarStore.freshTabList(filterList)
    router.push({ name: itemData.name })
  } else if (value === Eaction.reload) {
    tabBarStore.deleteCache(itemData)
    await router.push(itemData.fullPath)
    tabBarStore.addCache(itemData)
  } else {
    tabBarStore.resetTabList()
    router.push({ name: DEFAULT_ROUTE_NAME })
  }
}

defineExpose({ actionSelect })
</script>

<style scoped lang="scss">
.tag-tab-item {
  border-radius: var(--tab-bar-item-bg-radius);
  margin: auto 5px;
  height: var(--tab-bar-item-height);
  display: flex;
  align-items: center;
  background-color: var(--tab-bar-item-bg-color);
  box-shadow: 8px 8px 16px var(--tab-bar-item-bg-color);

  padding: 3px 10px;
  overflow-y: hidden;
}
.tag-link {
  color: var(--tab-bar-item-inactive-color);
  text-decoration: none;
}
.link-activated {
  color: var(--tab-bar-item-active-color);
  background: var(--tab-bar-item-active-bg-color);
  box-shadow: 8px 8px 16px var(--tab-bar-item-active-bg-color);
}
</style>
