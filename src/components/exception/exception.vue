<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import type { MessageSchema } from '@/i18n'
import { router } from '@/router'
import Icon404 from '@/components/exception/Icons/icon404.vue'
import Icon500 from '@/components/exception/Icons/icon500.vue'
import Icon401 from '@/components/exception/Icons/icon401.vue'

type ExceptionType = '401' | '403' | '404' | '500'

interface Props {
  type: ExceptionType
}

defineOptions({
  name: 'Exception',
})

defineProps<Props>()

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
    <div class="text-400px text-70px">
      <Icon401 v-if="type === '401'" class="w-500px h-500px" />
      <Icon404 v-if="type === '404'" class="w-500px h-500px" />
      <Icon500 v-else class="w-500px h-500px" />
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
