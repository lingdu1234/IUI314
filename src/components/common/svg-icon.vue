<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-01 10:14:26
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\components\common\svg-icon.vue
 * @Description: 
-->
<template>
  <svg aria-hidden="true">
    <use :fill="color" :xlink:href="symbolId" />
  </svg>
</template>

<script lang="ts" name="svg-icon" setup>
import { computed } from 'vue'

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
})
const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>
