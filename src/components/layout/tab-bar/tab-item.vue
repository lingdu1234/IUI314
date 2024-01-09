<!-- eslint-disable no-unused-vars -->
<template>
  <el-dropdown trigger="contextmenu" @command="actionSelect">
    <div class="flex items-center">
      <span
        class="tag-tab-item"
        :class="{ 'link-activated': itemData.fullPath === $route.fullPath }"
        @click="goto(itemData)"
      >
        <span class="tag-link cursor-pointer">
          {{
            itemData.i18n !== undefined &&
            itemData.i18n !== null &&
            itemData.i18n !== ''
              ? t(`route.${itemData.i18n}`)
              : itemData.title
          }}
        </span>
        <span
          class="m-l-10px cursor-pointer"
          @click.stop="tagClose(itemData, index)"
        >
          <el-icon><Close /></el-icon>
        </span>
      </span>
    </div>
    <template #dropdown>
      <TabBarItemDropdown :item-data="itemData" :index="index" />
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup name="tab-bar-item">
import { Close } from '@element-plus/icons-vue'
import { ElDropdown, ElIcon } from 'element-plus'
import type { PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

import type { MessageSchema } from '@/i18n'
import { DEFAULT_ROUTE_NAME } from '@/router'
import { useTabBarStore } from '@/stores'
import type { TagProps } from '@/types/base/router'

import TabBarItemDropdown from './tab-bar-item-dropdown.vue'
import { Eaction, useTabBar } from './useTabBar'

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
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

const actionSelect = async (value: Eaction) => {
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
    const filterList = tagList.value.filter((_el, idx) => {
      return idx === 0 || idx === props.index
    })
    tabBarStore.freshTabList(filterList)
    router.push({ name: itemData.name })
  } else if (value === Eaction.reload) {
    tabBarStore.reload(itemData)
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
  margin: auto 5px auto 0;
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
