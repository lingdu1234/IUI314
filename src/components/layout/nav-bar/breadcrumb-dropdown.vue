<script setup lang="ts">
import { type PropType, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { AppRouteRecordRaw } from '@/types/base/router'
import type { MessageSchema } from '@/i18n'
import BreadcrumbDropdownSub from '@/components/layout/nav-bar/breadcrumb-dropdown-sub.vue'

defineOptions({ name: 'BreadcrumbDropdown' })
const props = defineProps({
  list: {
    type: Object as PropType<AppRouteRecordRaw>,
    required: true,
  },
})
const dataList = computed<AppRouteRecordRaw>(() => props.list)
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
</script>

<template>
  <a-dropdown trigger="hover">
    <span>
      {{
        dataList.meta
          ? (dataList.meta.i18n && dataList.meta.i18n !== ''
            ? t(`route.${dataList.meta.i18n}`)
            : dataList.meta.title)
          : dataList.name

      }}
    </span>
    <template #content>
      <BreadcrumbDropdownSub v-for="child in dataList.children" :key="child.path" :list="child" />
    </template>
  </a-dropdown>
</template>
