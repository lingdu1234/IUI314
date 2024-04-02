<script lang="ts"  setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import type { MessageSchema } from '@/i18n'
import UnoIcon from '@/components/common/uno-icon.vue'
import { useUnoIcons } from '@/hooks/app/useUnoIcons'

defineOptions({ name: 'AboutAbout' })

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const { UnoIcons } = useUnoIcons()

const count = ref(0)
</script>

<template>
  <div>
    <UnoIcon name="s/404" />
    <UnoIcon name="s/bug" :size="32" />
    <UnoIcon name="c/edit-doc" size="16" />
    <UnoIcon name="c/edit-doc" size="64" fill="red" />
    <UnoIcon name="s/home-a" size="32" fill="red" />
    <UnoIcon name="c/exception404" size="512" />
    <div>{{ t('hello') }}</div>
    <div>{{ count }}</div>
    <div>{{ UnoIcons }}</div>
    <div>
      <a-button @click="() => count++">
        +++
      </a-button>
    </div>
    <a-space>
      <a-button type="primary">
        Square
      </a-button>
      <a-button type="primary" shape="round">
        Round
      </a-button>
      <a-button type="primary">
        <template #icon>
          <icon-plus />
        </template>
      </a-button>
      <a-button type="primary" shape="circle">
        <icon-plus />
      </a-button>
    </a-space>
  </div>
</template>
