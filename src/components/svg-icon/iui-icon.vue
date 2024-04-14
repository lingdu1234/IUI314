<script lang="ts" setup>
import { computed, defineOptions } from 'vue'
import type { IuiIconProps } from '@/components/svg-icon/iui-icon-props'

defineOptions({ name: 'IuiIcon' })

const props = withDefaults(defineProps<IuiIconProps>(), {
  size: 16,
  color: 'currentColor',
  rotate: 0,
  spin: false,
})
const symbolId = computed(() => `#icon-${props.name}`)
const iconSize = computed(() => `${props.size}px`)
const rotate = computed(() => `rotate(${props.rotate}deg)`)
const styleClass = computed(() => {
  const classList = ['display-class', 'vertical-middle']
  if (props.spin)
    classList.push('animate-spin')
  return classList.join(' ')
})
</script>

<template>
  <svg
    aria-hidden="true"
    :class="styleClass"
  >
    <use :fill="color" :href="symbolId" />
  </svg>
</template>

<style scoped lang="scss">
.display-class{
  display: inline-block;
  width: v-bind(iconSize);
  height: v-bind(iconSize);
  transform: v-bind(rotate);
}
</style>
