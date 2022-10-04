<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-01 10:14:26
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-04 16:17:23
 * @FilePath: \IUI314\src\components\common\svg-icon.vue
 * @Description: 
-->
<template>
  <svg aria-hidden="true">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script lang="ts" setup name="svg-icon">
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
