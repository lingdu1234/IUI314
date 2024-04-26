<script setup lang="ts">
import { type PropType, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { MessageSchema } from '@/i18n'
import { router } from '@/router'
import type { AppRouteRecordRaw } from '@/types/base/router'

defineOptions({ name: 'BreadcrumbDropdownSub' })
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
  <a-doption v-if="!dataList.children || dataList.children.length === 0">
    <span @click="router.push({ name: dataList.name })">
      {{
        dataList.meta
          ? (dataList.meta.i18n && dataList.meta.i18n !== ''
            ? t(`route.${dataList.meta.i18n}`)
            : dataList.meta.title)
          : dataList.name
      }}
    </span>
  </a-doption>
  <a-dsubmenu v-else trigger="hover">
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
      <BreadcrumbDropdownSub v-for="it in dataList.children" :key="it.path" :list="it" />
    </template>
  </a-dsubmenu>
</template>
