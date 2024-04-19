<script setup lang="ts">
import { unref } from 'vue'
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
  isSlot: false,
  fn: () => {},
})
</script>

<template>
  <template v-if="!isSlot">
    <a-button
      v-if="auth"
      :disabled="unref(disabled)"
      :type="type"
      :status="status"
      :shape="shape"
      :loading="unref(loading)"
      @click="fn as any"
    >
      {{ label }}
      <template #icon>
        <component :is="icon" />
      </template>
    </a-button>
  </template>
  <template v-if="isSlot">
    <slot :name="slotName" />
  </template>
</template>
