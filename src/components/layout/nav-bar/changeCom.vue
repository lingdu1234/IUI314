<script
    setup
    lang="ts"
    generic="T extends Record<string, any>"
>
import type { PropType } from 'vue'

defineOptions({ name: 'ChangeComp' })
defineProps({
  keyKey: {
    type: String,
    required: true,
  },
  valueKey: {
    type: String,
    required: true,
  },
  labelKey: {
    type: String,
    required: true,
  },
  options: {
    type: Array as PropType<T[]>,
    required: true,
  },
  mapOptions: {
    type: Object,
  },
})
const emit = defineEmits(['optionChange'])
const id = defineModel('id', { required: true })
</script>

<template>
  <a-radio-group v-model="id" direction="vertical" @change="emit('optionChange', id)">
    <a-radio
      v-for="item in options"
      :key="item && item[keyKey]"
      :value="item[valueKey]"
    >
      <span>{{ (item.parent_id !== '0' && mapOptions
        ? `${mapOptions[item.parent_id]}-`
        : '')
        + item[labelKey] }}</span>
    </a-radio>
  </a-radio-group>
</template>

<style scoped lang="scss">

</style>
