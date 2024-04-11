<script setup lang="ts">
import type { PropType } from 'vue'
import type { ButtonTypes } from '@arco-design/web-vue/es/button/constants'
import type { IuButtonStatus } from '@/types/arco.iu'

defineOptions({ name: 'IuButton' })
defineProps({
  icon: {
    type: Object as PropType<any>,
    default: null,
  },
  label: {
    type: String,
    default: '',
  },
  shape: {
    type: String as PropType<'square' | 'round' | 'circle'>,
    default: 'square',
  },
  size: {
    type: String as PropType<'mini' | 'small' | 'medium' | 'large'>,
    default: 'medium',
  },
  auth: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String as PropType<ButtonTypes>,
    default: 'secondary',
  },
  status: {
    type: String as PropType<IuButtonStatus>,
    default: 'normal',
  },
  fn: {
    type: Function,
    default: () => {},
  },
})
</script>

<template>
  <a-button
    v-if="auth"
    :disabled="disabled"
    :type="type"
    :status="status"
    :shape="shape"
    :loading="loading"
    @click="fn as any"
  >
    {{ label }}
    <template #icon>
      <component :is="icon" />
    </template>
  </a-button>
</template>
