<script setup lang="ts">
import { type PropType, ref } from 'vue'
import type { FormInstance } from '@arco-design/web-vue'
import { FormItemType, type IuFormField } from '@/types/base/iu-form'
import { useFormUtil } from '@/hooks'

defineProps({
  formItems: {
    type: Array as PropType<IuFormField[]>,
    required: true,
  },
  icon: {
    type: Object,
    default: null,
  },
  title: {
    type: String,
    default: '',
  },
  okText: {
    type: String,
    default: '确定',
  },
  cancelText: {
    type: String,
    default: '取消',
  },
  titleAlign: {
    type: String as PropType<'center' | 'start'>,
    default: 'start',
  },
})
const emit = defineEmits(['handleOk'])
const visible = defineModel('visible', { required: true, default: false })
const formValue = defineModel('formValue', { required: true, type: Object })
const isFullscreen = ref(false)
const modalFormRef = ref<FormInstance>()
const useForm = useFormUtil()
function beforeClose() {
  useForm.formReset(modalFormRef.value)
}
function handleCancel() {
  useForm.formReset(modalFormRef.value)
  visible.value = false
}
async function validateForm() {
  emit('handleOk')
  beforeClose()
}
function onBeforeOk() {
  return useForm.formValidate(modalFormRef.value)
}
</script>

<template>
  <a-modal
    v-model:visible="visible"
    width="auto"
    :ok-text="okText"
    :cancel-text="cancelText"
    :title-align="titleAlign"
    draggable
    :fullscreen="isFullscreen"
    :on-before-ok="onBeforeOk"
    @ok="validateForm"
    @cancel="handleCancel"
  >
    <template #title>
      <component :is="icon" />
      <span class="m-l-10px">{{ title }}</span>
    </template>
    <a-form
      ref="modalFormRef"
      :model="formValue"
      layout="horizontal"
      auto-label-width
      class="m-b-10px"
    >
      <a-form-item
        v-for="item in formItems"
        :key="item.field"
        :field="item.field"
        :label="item.label"
        :rules="item.rule"
        :validate-trigger="item.validateTrigger"
      >
        <a-input
          v-if="item.type === FormItemType.input"
          v-model="formValue[item.field]"
          :placeholder="item.placeholder"
          :disabled="item.disabled"
          style="width: 300px"
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
          style="width: 300px;position: relative"
        />
        <a-date-picker
          v-if="item.type === FormItemType.datePicker"
          v-model="formValue[item.field]"
          style="width: 300px;"
        />
        <a-textarea
          v-if="item.type === FormItemType.textarea"
          v-model="formValue[item.field]"
          allow-clear
          style="width: 300px;"
        />
        <a-radio-group
          v-if="item.type === FormItemType.radio && item.selectOption"
          v-model="formValue[item.field]"
          style="width: 300px;"
          :options="item.selectOption.dataOption"
          :disabled="item.disabled"
        />
        <a-input-number
          v-if="item.type === FormItemType.inputNumber"
          v-model="formValue[item.field]"
          :mode="item.inputNumberMode"
          style="width: 300px;"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped lang="scss">

</style>
