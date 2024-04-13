<script setup lang="ts" name="nav-bar-language">
import { useI18n } from 'vue-i18n'

import { langList } from '@/i18n'
import { useAppStore } from '@/stores'

defineOptions({ name: 'NavBarLanguage' })
const appStore = useAppStore()
const { locale } = useI18n()
function setLang(v: string) {
  appStore.setLang(v)
  locale.value = v
}
</script>

<template>
  <div>
    <a-dropdown trigger="hover">
      <div class="cursor-pointer">
        <IconLanguage />
      </div>
      <template #content>
        <a-doption
          v-for="lang in langList"
          :key="lang.k"
          @click="setLang(lang.k)"
        >
          <span
            :class="appStore.app.lang === lang.k ? 'font-bold' : 'font-normal'"
          >
            {{ lang.v }}
          </span>
        </a-doption>
      </template>
    </a-dropdown>
  </div>
</template>
