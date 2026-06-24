<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useUserStore } from '@/stores'
import type { MessageSchema } from '@/i18n'

defineOptions({ name: 'Dashboard' })

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const userStore = useUserStore()

const nickName = computed(() => userStore.user.name || '')
</script>

<template>
  <div class="dashboard">
    <a-card>
      <template #title>
        <span>{{ t('app.title') }}</span>
      </template>
      <a-typography-title :heading="3">
        {{ t('app.hello') }}，{{ nickName }}
      </a-typography-title>
      <a-typography-paragraph type="secondary">
        欢迎
      </a-typography-paragraph>
    </a-card>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 16px;
}
</style>
