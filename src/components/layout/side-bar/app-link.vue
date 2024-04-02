<script lang="ts" setup>
import { computed } from 'vue'

import { isExternal } from '@/hooks'

defineOptions({ name: 'AppLink' })

const props = defineProps({
  to: {
    type: String,
    required: true,
  },
})

const isExt = computed(() => {
  return isExternal(props.to)
})

const type = computed(() => {
  if (isExt.value)
    return 'a'

  return 'router-link'
})

function linkProps() {
  if (isExt.value) {
    return {
      href: props.to,
      target: '_blank',
      rel: 'noopener',
    }
  }
  return {
    to: props.to,
  }
}
</script>

<template>
  <component :is="type" v-bind="linkProps()">
    <slot />
  </component>
</template>
