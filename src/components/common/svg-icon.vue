<script lang="ts" setup>
import { computed } from 'vue'

defineOptions({ name: 'SvgIcon' })
const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: 'currentColor',
  },
  size: {
    type: [String, Number],
    default: 16,
  },
})
const symbolId = computed(() => `#${props.prefix}-${props.name}`)
const style = computed(() => `height: ${props.size}px;width: ${props.size}px;line-height: ${props.size}px;`)
</script>

<template>
  <svg aria-hidden="true" :style="style" class="vertical-middle">
    <use :fill="color" :href="symbolId" />
  </svg>
</template>
