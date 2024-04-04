<script setup lang="ts">
import { type PropType, computed, ref, watch } from 'vue'
import type { FormInstance } from '@arco-design/web-vue'
import { FormItemType, type IuFormField } from '@/types/base/iu-form'
import { useFormUtil } from '@/hooks'

defineOptions({ name: 'IuModal' })

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
    default: 'center',
  },
})
const emit = defineEmits(['handleOk'])
const visible = defineModel('visible', { required: true, default: false })
const formValue = defineModel('formValue', { required: true, type: Object })
const isFullscreen = ref(false)
const formLayout = ref<'horizontal' | 'vertical' | 'inline'>('horizontal')
const modalFormRef = ref<FormInstance>()
const useForm = useFormUtil()

const contentHeight = computed(() => 'calc(var(--vh) * 100) - 150')
watch(() => contentHeight.value, (v) => {
  console.log(v)
})

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

function toggleFullScreen() {
  isFullscreen.value = !isFullscreen.value
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
    class="iu-modal"
    @ok="validateForm"
    @cancel="handleCancel"
  >
    <template v-if="titleAlign === 'start'" #title>
      <div>
        <component :is="icon" />
        <span class="m-l-10px">{{ title }}</span>
      </div>
      <div>
        <span class="m-r-30px  arco-icon-hover">
          <IconFullscreen v-if="!isFullscreen" size="15" @click="toggleFullScreen" />
          <IconFullscreenExit v-if="isFullscreen" size="15" @click="toggleFullScreen" />
        </span>
      </div>
    </template>
    <template v-else #title>
      <div>
        <span class="arco-icon-hover">
          <IconFullscreen v-if="!isFullscreen" size="15" @click="toggleFullScreen" />
          <IconFullscreenExit v-if="isFullscreen" size="15" @click="toggleFullScreen" />
        </span>
      </div>
      <div>
        <component :is="icon" />
        <span class="m-l-10px">{{ title }}</span>
      </div>
      <div />
    </template>
    <a-scrollbar :style="`max-height:${contentHeight};overflow: auto;`" class="m-20px">
      <a-form
        ref="modalFormRef"
        :model="formValue"
        :layout="formLayout"
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
    </a-scrollbar>
  </a-modal>
</template>

<style lang="scss">
.iu-modal {
  .arco-modal-header {
    .arco-modal-title-align-start {
      justify-content: space-between;
    }

    .arco-modal-title-align-center {
      justify-content: space-between;
    }
  }
  .arco-modal-body{
    padding: 0 !important;
  }
}
</style>
