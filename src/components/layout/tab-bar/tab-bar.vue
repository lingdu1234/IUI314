<script lang="ts"  setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'
import { useWindowSize } from '@vueuse/core'
import BScroll from '@better-scroll/core'
import MouseWheel from '@better-scroll/mouse-wheel'
import TagBarOperation from './tag-bar-operation.vue'
import {
  listenerRouteChange,
  removeRouteListener,
} from '@/hooks'
import { usePermissionStore, useTabBarStore } from '@/stores'
import TabBarItem from '@/components/layout/tab-bar/tab-bar-item.vue'

defineOptions({ name: 'TabBar' })

BScroll.use(MouseWheel)

const tabBarStore = useTabBarStore()
const permissionStore = usePermissionStore()
const { width } = useWindowSize()
const tabScrollRef = ref()
const tabContainerRef = ref<HTMLDivElement>()
const tagList = computed(() => tabBarStore.getTabList)
let bs: BScroll
onMounted(() => {
  nextTick(() => {
    bs = new BScroll(tabScrollRef.value, {
      click: true,
      tap: 'tap',
      scrollX: true,
      mouseWheel: true,
      disableMouse: false,
      disableTouch: false,
    })
  },
  )
})

function moveToTarget() {
  const { scrollerWidth, maxScrollX, x } = bs

  //   当 maxScrollX === 0 啥也不干,还在可视区域内，即 barWidth < visibleWidth
  if (maxScrollX !== 0) {
  //   如果 maxScrollX == 0 计算当前元素的偏移量
    const index = tabBarStore.getCurrentRouteIndex()
    const contents = tabContainerRef.value?.children as HTMLCollection as any as HTMLDivElement[]
    // 可见的容器宽度
    const visibleWidth = scrollerWidth + maxScrollX
    // 当前路由tab及之前的元素宽度之和
    let barWidth = 0
    for (let i = 0; i <= index; i++)
      barWidth += contents[i].offsetWidth
    //   x为当前左偏移量为负值
    //  当当前TabBar的宽度 减去做偏倚的x 还大于可见容器宽度时，说明在右侧不可见，自动滚动到元素中间
    //  当当前TabBar的宽度 减去做偏倚的x 小于0时，说明该元素被隐藏在左侧,不可见，自动滚动到元素中间
    if (barWidth - x > visibleWidth || x + barWidth < 0) {
      const current = contents[index] as any
      bs.scrollToElement(current, 500, true, true)
    }
  }
}

// 监听路由变化，添加tabList
listenerRouteChange((route: RouteLocationNormalized) => {
  for (let index = 0; index < tagList.value.length; index++) {
    const element = tagList.value[index]
    if (element.path === route.path) {
      tabBarStore.setTabList(route, index)
      return
    }
    if (index === tagList.value.length - 1) {
      tabBarStore.updateTabList(route)
      return
    }
  }
}, true)
watch(
  () => [tagList.value, permissionStore.routeIsDone, width.value],
  () => {
    // 只能设置一个变量来监控路由加载完成后再操作
    if (permissionStore.routeIsDone) {
      nextTick(() => {
        bs.refresh()
        nextTick(() => moveToTarget())
      })
    }
  },
)

onUnmounted(() => {
  removeRouteListener()
})
</script>

<template>
  <div class="relative w-100% tab-bar-container">
    <div class="flex items-center justify-between">
      <div
        ref="tabScrollRef"
        class="m-t-0px m-b-5px m-l-10px m-r-5px flex items-center tab-bar-box-scroll"
      >
        <div ref="tabContainerRef" class="p-l--5px tags-wrap flex">
          <TabBarItem v-for="item in tagList" :key="item.fullPath" :item-data="item" />
        </div>
      </div>
      <TagBarOperation />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tab-bar-container {
  background-color: var(--tab-bar-bg-color);

  .tab-bar-box-scroll {
    padding: 1px 0;
    width: calc(100% - var(--tab-bar-operation-width));
    overflow: hidden;
    flex-grow: 1;
    flex-shrink: 1;

    .tags-wrap {
      white-space: nowrap;
    }
  }
}
</style>
