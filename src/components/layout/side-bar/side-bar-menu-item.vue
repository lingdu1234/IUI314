<script lang="ts" setup>
import { type PropType, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import AppLink from './app-link.vue'
import IuiIcon from '@/components/svg-icon/iui-icon.vue'
import { getNormalPath, getQueryUrl, isExternal } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import type { AppRouteRecordRaw } from '@/types/base/router'

defineOptions({ name: 'SideBarMenuItem' })

const props = defineProps({
  item: {
    type: Object as PropType<AppRouteRecordRaw>,
    required: true,
  },
  basePath: {
    type: String,
    default: '',
  },
})
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const onlyOneChild = ref<AppRouteRecordRaw>()

function hasOneShowingChild(
  children: AppRouteRecordRaw[] = [],
  parent: AppRouteRecordRaw,
) {
  if (!children)
    children = []

  const showingChildren = children.filter((item) => {
    if (item.hidden) {
      return false
    }
    else {
      // Temp set(will be used if only has one showing child)
      onlyOneChild.value = item
      return true
    }
  })

  // When there is only one child router, the child router is displayed by default
  if (showingChildren.length === 1)
    return true

  // Show parent if there are no child router to display
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
    return true
  }

  return false
}

function resolvePath(routePath: string, routeQuery?: string): string {
  if (isExternal(routePath))
    return routePath

  if (isExternal(props.basePath))
    return props.basePath

  if (routeQuery) {
    const query = JSON.parse(routeQuery)
    return getQueryUrl(getNormalPath(`${props.basePath}/${routePath}`), query)
      .value
  }
  return getNormalPath(`${props.basePath}/${routePath}`)
}
</script>

<template>
  <div v-if="!item.hidden">
    <template
      v-if="
        hasOneShowingChild(item.children, item)
          && (!onlyOneChild?.children || onlyOneChild.noShowingChildren)
          && !item.always_show
      "
    >
      <AppLink
        v-if="onlyOneChild?.meta"
        :to="resolvePath(onlyOneChild.path, onlyOneChild.query)"
      >
        <a-menu-item
          :key="resolvePath(onlyOneChild.path)"
        >
          <template #icon>
            <IuiIcon
              :name="
                onlyOneChild.meta?.icon
                  || (item.meta && item.meta.icon)
                  || ''
              "
            />
          </template>

          <span
            v-if="
              onlyOneChild.meta?.i18n
                && onlyOneChild.meta?.i18n !== ''
            "
          >
            {{ t(`route.${onlyOneChild.meta?.i18n}`) }}
          </span>
          <span v-else>
            {{ onlyOneChild.meta?.title }}
          </span>
        </a-menu-item>
      </AppLink>
    </template>

    <a-sub-menu v-else :key="resolvePath(item.path)">
      <template v-if="item.meta" #icon>
        <IuiIcon :name="(item.meta && item.meta.icon) || ''" />
      </template>
      <template v-if="item.meta" #title>
        <span
          v-if="
            item.meta?.i18n && item.meta?.i18n !== ''
          "
          class="menu-title"
        >
          {{ t(`route.${item.meta?.i18n}`) }}
        </span>
        <span v-else class="menu-title">
          {{ item.meta?.title }}
        </span>
      </template>

      <div v-if="item.children && item.children.length > 0">
        <side-bar-menu-item
          v-for="child in item.children"
          :key="child.path"
          :base-path="resolvePath(child.path)"
          :item="child"
        />
      </div>
    </a-sub-menu>
  </div>
</template>

<style lang="scss" scoped>
// 去掉菜单下划线
// .router-link-active,
// a {
//   text-decoration: none;
// }
</style>
