<script setup lang="ts">
import type { iuButtonPropsType } from '@/components/iui/iui-props'

defineOptions({ name: 'IuButton' })

withDefaults(defineProps<iuButtonPropsType>(), {
  label: '',
  shape: 'square',
  size: 'medium',
  auth: true,
  disabled: false,
  loading: false,
  type: 'secondary',
  status: 'normal',
  fn: () => {},
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
