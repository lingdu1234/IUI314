<script lang="ts"  setup>
import { useI18n } from 'vue-i18n'

import SvgIcon from '../common/svg-icon.vue'
import { useTheme } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { useAppStore } from '@/stores'

defineOptions({ name: 'NavBarTheme' })
const appStore = useAppStore()
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const { set_theme, theme_list } = useTheme()
</script>

<template>
  <div>
    <a-dropdown trigger="hover">
      <div class="cursor-pointer">
        <SvgIcon name="theme" />
      </div>
      <template #content>
        <a-doption
          v-for="theme in theme_list"
          :key="theme"
          @click="set_theme(theme)"
        >
          <span
            :class="appStore.app.theme === theme ? 'font-bold' : 'font-normal'"
          >
            {{ t(`theme.${theme}`) }}
          </span>
        </a-doption>
      </template>
    </a-dropdown>
  </div>
</template>
