<script lang="ts" setup>
import { type PropType, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { TabAction } from './useTabBar'
import type { MessageSchema } from '@/i18n'
import type { TagProps } from '@/types/base/router'
import { useTabBarStore } from '@/stores'

defineOptions({ name: 'TabBarItemDropdown' })

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
const tabBarStore = useTabBarStore()

const disabledReload = computed(
  () => props.itemData.fullPath !== route.fullPath,
)

const disabledCurrent = computed(() => {
  return props.index === 0
})

const disabledLeft = computed(() => {
  return [0, 1].includes(props.index)
})

const disabledRight = computed(() => {
  return props.index === tabBarStore.tagList.length - 1
})
</script>

<template>
  <a-doption :disabled="disabledReload" @click="tabBarStore.tabActionSelect(props.itemData, TabAction.reload)">
    <template #icon>
      <IconRefresh />
    </template>
    <span>{{ t('tab.refresh') }}</span>
  </a-doption>
  <a-doption :disabled="disabledCurrent" @click="tabBarStore.tabActionSelect(props.itemData, TabAction.current)">
    <template #icon>
      <IconClose />
    </template>
    <span>{{ t('tab.closeCurrentTab') }}</span>
  </a-doption>
  <a-doption :disabled="disabledLeft" @click="tabBarStore.tabActionSelect(props.itemData, TabAction.left)">
    <template #icon>
      <IconArrowLeft />
    </template>
    <span>{{ t('tab.closeLeftTab') }}</span>
  </a-doption>
  <a-doption :disabled="disabledRight" @click="tabBarStore.tabActionSelect(props.itemData, TabAction.right)">
    <template #icon>
      <IconArrowRight />
    </template>
    <span>{{ t('tab.closeRightTab') }}</span>
  </a-doption>
  <a-doption :disabled="disabledCurrent" @click="tabBarStore.tabActionSelect(props.itemData, TabAction.others)">
    <template #icon>
      <IconSwap />
    </template>
    <span>{{ t('tab.closeOtherTab') }}</span>
  </a-doption>
  <a-doption @click="tabBarStore.tabActionSelect(props.itemData, TabAction.all)">
    <template #icon>
      <IconFire />
    </template>
    <span>{{ t('tab.closeAllTab') }}</span>
  </a-doption>
</template>
