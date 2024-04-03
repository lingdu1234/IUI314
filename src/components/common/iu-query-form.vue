<script setup lang="ts">
import type { PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import { FormItemType, type IuQueryFormField } from '@/types/base/iu-form'
import type { MessageSchema } from '@/i18n'

defineOptions({ name: 'IuQueryForm' })
defineProps({
  formItems: {
    type: Array as PropType<IuQueryFormField[]>,
    required: true,
  },
})
const emit = defineEmits(['query'])
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const formValue = defineModel('formValue', { type: Object, required: true })
function resetQuery() {
  formValue.value = {}
  emit('query')
}
</script>

<template>
  <a-form :model="formValue" layout="inline" class="m-b-10px">
    <a-form-item v-for="item in formItems" :key="item.field" :field="item.field" :label="item.label">
      <a-input
        v-if="item.type === FormItemType.input"
        v-model="formValue[item.field]"
        :placeholder="item.placeholder"
        style="width: 200px"
      />
      <a-select
        v-if="item.type === FormItemType.select && item.selectOption"
        v-model="formValue[item.field]"
        :options="item.selectOption.dataOption"
        :field-names="item.selectOption.dataOptionKey"
        :placeholder="item.placeholder"
        :allow-clear="item.selectOption.allowClear"
        :multiple="item.selectOption.multiple"
        :allow-search="item.selectOption.allowSearch"
        style="width: 200px;position: relative"
      />
      <a-date-picker
        v-if="item.type === FormItemType.datePicker"
        v-model="formValue[item.field]"
        style="width: 200px;"
      />
    </a-form-item>
    <a-space>
      <a-button type="primary" @click="emit('query')">
        <template #icon>
          <icon-search />
        </template>
        {{ t('common.search') }}
      </a-button>
      <a-button status="success" @click="resetQuery">
        <template #icon>
          <icon-sync />
        </template>
        {{ t('common.reset') }}
      </a-button>
    </a-space>
  </a-form>
</template>

<style scoped lang="scss">

</style>
