<script setup lang="ts">
import { type PropType, computed, ref } from 'vue'
import type { FormInstance } from '@arco-design/web-vue'
import { FormItemType, type IuFormField, type dataOptionTypeRadio } from '@/types/base/iu-form'
import { useFormUtil } from '@/hooks'

defineOptions({ name: 'IuModal' })

const props = defineProps({
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
  labelWidth: {
    type: Number,
    default: 80,
  },
  itemWidth: {
    type: Number,
    default: 300,
  },
  defaultCol: {
    type: Number,
    default: 1,
  },
  fullScreenCol: {
    type: Number,
    default: 2,
  },
})
const emit = defineEmits(['handleOk'])
const visible = defineModel('visible', { required: true, default: false })
const formValue = defineModel('formValue', { required: true, type: Object })
const isFullscreen = ref(false)
const formLayout = ref<'horizontal' | 'vertical' | 'inline'>('inline')
const modalFormRef = ref<FormInstance>()
const useForm = useFormUtil()

const contentHeight = computed(() => 'calc(calc(var(--vh) * 100) - 200px')

function getItemStyle(item: IuFormField) {
  switch (isFullscreen.value) {
    case true:
      return item.fullScreenIsOnlyOne
        ? {
            width: '100%',
          }
        : {
            width: `${props.itemWidth}px`,
          }
    case false: {
      const width = item.defaultItemWidth || props.itemWidth
      return {
        width: `${width}px`,
      }
    }
    default:
      return {
        width: `${props.itemWidth}px`,
      }
  }
}

const labelColStyle = computed(() => (
  { width: `${props.labelWidth}px` }
))

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
    <a-scrollbar :style="`max-height:${contentHeight};overflow: auto;`" class="flex justify-center m-20px">
      <div>
        <a-form
          ref="modalFormRef"
          :model="formValue"
          :layout="formLayout"
          auto-label-width
          class="m-b-10px"
        >
          <a-grid :cols="isFullscreen ? fullScreenCol : defaultCol">
            <a-grid-item
              v-for="item in formItems"
              :key="item.field"
              :span="isFullscreen ? item.fullScreenCol : item.defaultCol"
            >
              <a-form-item
                :field="item.field"
                :label="item.label"
                :rules="item.rule"
                :label-col-style="labelColStyle"
                :validate-trigger="item.validateTrigger"
              >
                <span
                  v-if="item.type === FormItemType.text"
                  class="break-words"
                  :style="getItemStyle(item)"
                >
                  {{ formValue[item.field] }}
                </span>
                <a-input
                  v-if="item.type === FormItemType.input"
                  v-model="formValue[item.field]"
                  :placeholder="item.placeholder"
                  :disabled="item.disabled"
                  :style="getItemStyle(item)"
                />
                <a-select
                  v-if="item.type === FormItemType.select && item.selectOption"
                  v-model="formValue[item.field]"
                  :options="item.selectOption.dataOption as any"
                  :field-names="item.selectOption.dataOptionKey"
                  :placeholder="item.placeholder"
                  :allow-clear="item.selectOption.allowClear"
                  :multiple="item.selectOption.multiple"
                  :allow-search="item.selectOption.allowSearch"
                  :style="getItemStyle(item)"
                  style="position: relative"
                />
                <a-date-picker
                  v-if="item.type === FormItemType.datePicker"
                  v-model="formValue[item.field]"
                  :style="getItemStyle(item)"
                />
                <a-textarea
                  v-if="item.type === FormItemType.textarea"
                  v-model="formValue[item.field]"
                  allow-clear
                  :auto-size="item.textAreaAutoSize"
                  :style="getItemStyle(item)"
                />
                <a-radio-group
                  v-if="item.type === FormItemType.radio && item.selectOption"
                  v-model="formValue[item.field]"
                  :style="getItemStyle(item)"
                  :options="item.selectOption.dataOption as dataOptionTypeRadio"
                  :disabled="item.disabled"
                />
                <a-input-number
                  v-if="item.type === FormItemType.inputNumber"
                  v-model="formValue[item.field]"
                  :mode="item.inputNumberMode"
                  :style="getItemStyle(item)"
                />
              </a-form-item>
            </a-grid-item>
          </a-grid>
        </a-form>
      </div>
    </a-scrollbar>
  </a-modal>
</template>
