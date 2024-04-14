<script lang="ts"  setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import type { MessageSchema } from '@/i18n'
import { useIuiIcons } from '@/components/svg-icon/useIuiIcons'
import IuiIcon from '@/components/svg-icon/iui-icon.vue'

defineOptions({ name: 'AboutAbout' })

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const { IuiIcons } = useIuiIcons()

const count = ref(0)
</script>

<template>
  <div>
    <IuiIcon name="bug" :size="32" spin />

    <IuiIcon name="exception404" :size="512" :rotate="-30" />
    <div>{{ t('hello') }}</div>
    <div>{{ count }}</div>
    <div>{{ IuiIcons }}</div>
    <div>
      <a-button @click="() => count++">
        +++
      </a-button>
    </div>
  </div>
</template>
