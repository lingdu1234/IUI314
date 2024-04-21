<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import type { MessageSchema } from '@/i18n'
import { router } from '@/router'

defineOptions({
  name: 'Exception',
})

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const route = useRoute()
const routeHomePath = '/index'
function back() {
  if (route.query.noGoBack)
    router.push({ path: '/' })
  else
    router.go(-1)
}
</script>

<template>
  <div class="flex m-t-10vh items-center flex-col w-full h-full">
    <div class="text-70px">
      <slot name="exceptionIcon" />
    </div>
    <div>
      <router-link :to="routeHomePath" class="decoration-none">
        <a-button class="m-20px" type="primary" @click="back">
          {{ t('common.back') }}
        </a-button>
      </router-link>
      <router-link :to="routeHomePath" class="decoration-none">
        <a-button class="m-20px" type="primary">
          {{ t('common.home') }}
        </a-button>
      </router-link>
    </div>
  </div>
</template>
