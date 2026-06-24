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

// 语义颜色名映射到 Arco Tag 实际颜色
const colorMap: Record<string, string> = {
  primary: 'arcoblue',
  success: 'green',
  warning: 'orange',
  danger: 'red',
  info: 'gray',
  default: '',
}

function mapColor(color?: string): string | undefined {
  if (!color)
    return undefined
  return colorMap[color] ?? color
}

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
          <a-tag :color="mapColor(item.elTagClass)">{{ item.label }}</a-tag>
        </span>
        <span v-else-if="item.elTagType">
          <a-tag :color="mapColor(item.elTagType)">{{ item.label }}</a-tag>
        </span>
        <span v-else>
          {{ item.label }}
        </span>
      </template>
    </template>
  </div>
</template>
