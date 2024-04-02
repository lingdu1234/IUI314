<script lang="ts" setup name="dict-tag">
import { ElTag } from 'element-plus'
import { type PropType, computed } from 'vue'

import type { dictUse } from '@/types/system/dict'

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
  if (props.value !== null && typeof props.value !== 'undefined')
    return Array.isArray(props.value) ? props.value : [String(props.value)]
  else
    return []
})
</script>

<template>
  <div>
    <template v-for="(item, index) in options">
      <template v-if="values.includes(item.value)">
        <span
          v-if="item.elTagType == 'default' || item.elTagType == ''"
          :key="item.value"
          :index="index"
          :class="item.elTagClass!"
        >
          {{ item.label }}
        </span>
        <ElTag
          v-else
          :key="`${item.value}`"
          :disable-transitions="true"
          :index="index"
          :type="item.elTagType === 'primary' ? '' : item.elTagType!"
          :class="item.elTagClass"
        >
          {{ item.label }}
        </ElTag>
      </template>
    </template>
  </div>
</template>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
