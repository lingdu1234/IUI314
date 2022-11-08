<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-01 09:02:50
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\components\layout\side-bar\app-link.vue
 * @Description: 
-->
<template>
  <component :is="type" v-bind="linkProps()">
    <slot />
  </component>
</template>

<script lang="ts" setup name="app-link">
import { computed } from 'vue'

import { isExternal } from '@/hooks'

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
  if (isExt.value) {
    return 'a'
  }
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
