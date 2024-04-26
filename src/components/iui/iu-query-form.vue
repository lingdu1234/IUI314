<script setup lang="ts">
import { type PropType, computed, unref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { MessageSchema } from '@/i18n'
import { FormItemType, type IuQueryFormField } from '@/types/base/iu-form'

defineOptions({ name: 'IuQueryForm' })
const props = defineProps({
  formItems: {
    type: Array as PropType<IuQueryFormField[]>,
    required: true,
  },
  labelWidth: {
    type: Number,
    default: 80,
  },
})
const emit = defineEmits(['query'])
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const formValue = defineModel('formValue', { type: Object, required: true })
function resetQuery() {
  formValue.value = {}
  emit('query')
}
const labelColStyle = computed(() => (
  { width: `${props.labelWidth}px` }
))
</script>

<template>
  <a-form :model="formValue" layout="inline" class="m-b-10px">
    <a-form-item
      v-for="item in formItems"
      :key="item.field"
      :field="item.field"
      :label="item.label"
      :label-col-style="labelColStyle"
      class="m-b-0"
    >
      <a-input
        v-if="item.type === FormItemType.input && item.input"
        v-model="formValue[item.field]"
        :placeholder="item?.input?.placeholder"
        :disabled="unref(item?.input?.disabled)"
        :allow-clear="item?.input?.allowClear"
        :readonly="item?.input?.readonly"
        :size="item?.input?.size"
        style="width: 200px"
      />
      <a-select
        v-if="item.type === FormItemType.select && item.select"
        v-model="formValue[item.field]"
        :options="unref(item?.select?.options)"
        :field-names="item?.select?.fieldNames"
        :placeholder="item?.select?.placeholder"
        :allow-clear="item?.select?.allowClear"
        :multiple="item?.select?.multiple"
        :allow-search="item?.select?.allowSearch"
        style="width: 200px;position: relative"
      />
      <a-date-picker
        v-if="item.type === FormItemType.datePicker"
        v-model="formValue[item.field]"
        :position="item?.datePicker?.position"
        :allow-clear="item?.datePicker?.allowClear"
        :readonly="item?.datePicker?.readonly"
        style="width: 200px;"
      />
    </a-form-item>
    <a-form-item :label-col-style="labelColStyle">
      <a-space>
        <a-button type="primary" @click="emit('query')">
          <template #icon>
            <icon-search />
          </template>
          {{ t('sys.search') }}
        </a-button>
        <a-button status="success" @click="resetQuery">
          <template #icon>
            <icon-sync />
          </template>
          {{ t('sys.reset') }}
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<style scoped lang="scss">

</style>
