<template>
  <div v-if="!item.hidden">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild?.children || onlyOneChild.noShowingChildren) &&
        !item.always_show
      "
    >
      <app-link
        v-if="onlyOneChild?.meta"
        :to="resolvePath(onlyOneChild.path, onlyOneChild.query)"
      >
        <el-menu-item
          :class="{ 'submenu-title-noDropdown': !isNest }"
          :index="resolvePath(onlyOneChild.path)"
        >
          <template #title>
            <el-icon>
              <SvgIcon
                :name="
                  onlyOneChild.meta?.icon || (item.meta && item.meta.icon) || ''
                "
              />
            </el-icon>
            <span
              v-if="
                onlyOneChild.meta?.i18n !== undefined &&
                onlyOneChild.meta?.i18n !== null &&
                onlyOneChild.meta?.i18n !== ''
              "
              class="menu-title"
            >
              {{ t(`route.${onlyOneChild.meta?.i18n}`) }}
            </span>
            <span v-else class="menu-title">
              {{ onlyOneChild.meta?.title }}
            </span>
          </template>
        </el-menu-item>
      </app-link>
    </template>

    <el-sub-menu v-else ref="subMenu" :index="resolvePath(item.path)">
      <template v-if="item.meta" #title>
        <el-icon>
          <SvgIcon :name="(item.meta && item.meta.icon) || ''" />
        </el-icon>
        <span
          v-if="
            item.meta?.i18n !== undefined &&
            item.meta?.i18n !== null &&
            item.meta?.i18n !== ''
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
          :is-nest="true"
          :item="child"
          class="nest-menu"
        />
      </div>
    </el-sub-menu>
  </div>
</template>
<script lang="ts" name="side-bar-menu-item" setup>
import { type PropType, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import SvgIcon from '@/components/common/svg-icon.vue'
import { getNormalPath, getQueryUrl, isExternal } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import type { AppRouteRecordRaw } from '@/types/base/router'

import AppLink from './app-link.vue'
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const props = defineProps({
  item: {
    type: Object as PropType<AppRouteRecordRaw>,
    required: true,
  },
  isNest: {
    type: Boolean,
    default: false,
  },
  basePath: {
    type: String,
    default: '',
  },
})

const onlyOneChild = ref<AppRouteRecordRaw>()

function hasOneShowingChild(
  children: AppRouteRecordRaw[] = [],
  parent: AppRouteRecordRaw
) {
  if (!children) {
    children = []
  }
  const showingChildren = children.filter((item) => {
    if (item.hidden) {
      return false
    } else {
      // Temp set(will be used if only has one showing child)
      onlyOneChild.value = item
      return true
    }
  })

  // When there is only one child router, the child router is displayed by default
  if (showingChildren.length === 1) {
    return true
  }

  // Show parent if there are no child router to display
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
    return true
  }

  return false
}

function resolvePath(routePath: string, routeQuery?: string): string {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }
  if (routeQuery) {
    let query = JSON.parse(routeQuery)
    return getQueryUrl(getNormalPath(props.basePath + '/' + routePath), query)
      .value
  }
  return getNormalPath(props.basePath + '/' + routePath)
}
</script>
<style lang="scss" scoped>
.menu-title {
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}
// 去掉菜单下划线
.router-link-active,
a {
  text-decoration: none;
}

.el-menu {
  background-color: black;
  border-radius: 20px;
}
</style>
