<script lang="ts"  setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import IuiIcon from '@/components/svg-icon/iui-icon.vue'
import { useIuiIcons } from '@/components/svg-icon/useIuiIcons'
import type { MessageSchema } from '@/i18n'

defineOptions({ name: 'AboutAbout' })

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const { IuiIcons } = useIuiIcons()

const count = ref(0)
</script>

<template>
  <div>
    <IuiIcon name="bug" :size="32" spin />

    <div>{{ t('app.hello') }}</div>
    <div>{{ t('app.hello') }}</div>
    <div>{{ t('app.hello') }}</div>
    <div>{{ t('app.hello') }}</div>
    <div>{{ t('app.hello') }}</div>

    <div>{{ count }}</div>
    <div>{{ IuiIcons }}</div>
    <div>
      <a-button @click="() => count++">
        +++
      </a-button>
    </div>
  </div>
</template>
