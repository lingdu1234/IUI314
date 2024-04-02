<!-- eslint-disable no-unused-vars -->
<script lang="ts" setup>
import { type PropType, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useTabBar } from './useTabBar'
import type { MessageSchema } from '@/i18n'
import { useTabBarStore } from '@/stores'
import type { TagProps } from '@/types/base/router'
import TabBarItemDropdown from '@/components/layout/tab-bar/tab-bar-item-dropdown.vue'

defineOptions({ name: 'TabBarItem' })

const props = defineProps({
  itemData: {
    type: Object as PropType<TagProps>,
    default() {
      return []
    },
  },
})
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const { goto } = useTabBar()

const tabBarStore = useTabBarStore()

const index = computed(() => tabBarStore.getTabIndex(props.itemData))
</script>

<template>
  <a-dropdown trigger="contextMenu">
    <div class="flex items-center">
      <span
        class="tag-tab-item"
        :class="{ 'link-activated': itemData.fullPath === $route.fullPath }"
        @click="goto(itemData)"
      >
        <span class="tag-link cursor-pointer">
          {{
            itemData.i18n && itemData.i18n !== ''
              ? t(`route.${itemData.i18n}`)
              : itemData.title
          }}
        </span>
        <span
          class="m-l-10px cursor-pointer"
          @click.stop="tabBarStore.tagClose(itemData)"
        >
          <IconClose />
        </span>
      </span>
    </div>
    <template #content>
      <TabBarItemDropdown :item-data="itemData" :index="index" />
    </template>
  </a-dropdown>
</template>

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
