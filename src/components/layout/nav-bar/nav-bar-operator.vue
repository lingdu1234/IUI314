<script lang="ts"  setup>
import { useI18n } from 'vue-i18n'
import NavBarUser from './nav-bar-user.vue'
import AppSettings from '@/components/app/app-settings.vue'
import NavBarLanguage from '@/components/app/nav-bar-language.vue'
import NavBarLock from '@/components/app/nav-bar-lock.vue'
import NavBarSize from '@/components/app/nav-bar-size.vue'
import NavBarTheme from '@/components/app/nav-bar-theme.vue'
import ScreenFull from '@/components/app/screen-full.vue'
import type { MessageSchema } from '@/i18n'

defineOptions({ name: 'NavBarOperator' })

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
</script>

<template>
  <div class="flex items-center justify-end m-r-10px">
    <div class="nav-bar-operator flex justify-evenly items-center">
      <NavBarLock />
      <NavBarLanguage />
      <NavBarTheme />
      <ScreenFull />
      <NavBarSize />
      <AppSettings />
    </div>
    <div>
      <NavBarUser />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav-bar-operator {
  width: var(--nav-bar-operation-width);
}
</style>
