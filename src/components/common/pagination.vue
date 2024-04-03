<script lang="ts" setup>
import type { PropType } from 'vue'

defineOptions({ name: 'Pagination' })

defineProps({
  total: {
    required: true,
    default: 0,
  },
  isSimple: {
    type: Boolean,
    default: true,
  },
  pageSizes: {
    type: Array as PropType<number[]>,
    default() {
      return [10, 20, 30, 40, 50]
    },
  },
})

const emit = defineEmits(['pagination'])
const page = defineModel('page', { type: Number, default: 1 })
const limit = defineModel('limit', { type: Number, default: 10 })

function handleChange() {
  emit('pagination')
}
</script>

<template>
  <div class="pagination-container">
    <a-pagination
      v-model:current="page"
      v-model:page-size="limit"
      :total="total"
      :page-size-options="pageSizes"
      :simple="isSimple"
      show-page-size
      show-total
      show-jumper
      @change="handleChange"
      @page-size-change="handleChange"
    />
  </div>
</template>

<style lang="scss" scoped>
.pagination-container {
  height: 55px;
  padding: 12px 16px 0;
  margin-bottom: 30px;
}
</style>
