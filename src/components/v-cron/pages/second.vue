<script setup lang="ts">
import type { vCronItem } from '@/components/v-cron/v-cron-const'

defineOptions({ name: 'Second' })
defineProps<dataType>()
interface dataType {
  type: vCronItem.second | vCronItem.minute
}
const data = defineModel<string | undefined>('data', { required: true })
</script>

<template>
  <a-radio-group direction="vertical">
    <a-radio value="A">
      A
    </a-radio>
    <a-radio value="B">
      B
    </a-radio>
    <a-radio value="C">
      C
    </a-radio>
    <a-radio value="D">
      D
    </a-radio>
  </a-radio-group>
</template>

<style scoped lang="scss">

</style>
