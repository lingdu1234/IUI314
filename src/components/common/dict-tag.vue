<script lang="ts" setup>
import { type PropType, computed } from 'vue'

import type { dictUse } from '@/types/system/dict'

defineOptions({ name: 'DictTag' })

const props = defineProps({
  // 数据
  options: {
    type: Array as PropType<dictUse[]>,
    default: null,
  },
  // 当前的值
  value: [Number, String, Array],
})

const values = computed(() => {
  if (props.value && typeof props.value !== 'undefined')
    return Array.isArray(props.value) ? props.value : [String(props.value)]
  else
    return []
})
</script>

<template>
  <div>
    <template v-for="(item, index) in options" :key="index">
      <template v-if="values.includes(item.value)">
        <span v-if="item.elTagClass && item.elTagClass !== ''">
          <a-tag :color="item.elTagClass">{{ item.label }}</a-tag>
        </span>
        <span v-else-if="item.elTagType">
          <a-tag :color="item.elTagType">{{ item.label }}</a-tag>
        </span>
        <span v-else>
          {{ item.label }}
        </span>
      </template>
    </template>
  </div>
</template>
