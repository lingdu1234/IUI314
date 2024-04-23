<script setup lang="ts">
import type { FormInstance } from '@arco-design/web-vue'
import { computed, ref, unref } from 'vue'
import type { iuModalPropsType } from '@/components/iui/iui-props'
import { useFormUtil, useMobile, useOrientation } from '@/hooks'
import { FormItemType, type IuFormField, type dataOptionTypeRadio } from '@/types/base/iu-form'

defineOptions({ name: 'IuModal' })

const props = withDefaults(defineProps<iuModalPropsType>(), {
  title: '',
  okText: '确定',
  cancelText: '取消',
  titleAlign: 'center',
  labelWidth: 80,
  itemWidth: 300,
  defaultCol: 1,
  fullScreenCol: 2,
})

const emit = defineEmits(['handleOk'])

const visible = defineModel('visible', { required: true, default: false })
const formValue = defineModel('formValue', { required: true, type: Object })
const isFullscreen = ref(false)
const formLayout = ref<'horizontal' | 'vertical' | 'inline'>('inline')
const modalFormRef = ref<FormInstance>()
const useForm = useFormUtil()

const { isPortrait } = useOrientation()
const { isMobile } = useMobile()

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
      switch (item.defaultIsOnlyOne) {
        case true:
          return {
            width: '100%',
          }
        default: {
          const width = item.defaultItemWidth || props.itemWidth
          return {
            width: `${width}px`,
          }
        }
      }
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
function validateModalField(v: string | string[]) {
  modalFormRef.value?.validateField(v)
}

function onBeforeOk() {
  return useForm.formValidate(modalFormRef.value)
}

function toggleFullScreen() {
  isFullscreen.value = !isFullscreen.value
}

defineExpose({ validateModalField })
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
          <a-grid :cols=" isMobile && isPortrait ? 1 : isFullscreen ? fullScreenCol : defaultCol">
            <a-grid-item
              v-for="item in formItems"
              v-show="item.vShow === undefined ? true : item.vShow"
              :key="item.field"
              :span="isFullscreen ? item.fullScreenCol : item.defaultCol"
            >
              <a-form-item
                :field="item.field"
                :label="item.label"
                :rules="item.rule"
                :label-col-style="labelColStyle"
                :validate-trigger="item.validateTrigger"
                :tooltip="item.tooltip"
              >
                <span
                  v-if="item.type === FormItemType.text"
                  class="break-words ws-pre-wrap"
                  :style="getItemStyle(item)"
                >
                  {{ formValue[item.field] }}
                </span>
                <a-input
                  v-if="item.type === FormItemType.input"
                  v-model="formValue[item.field]"
                  :placeholder="item.placeholder"
                  :disabled="unref(item.disabled)"
                  :style="getItemStyle(item)"
                />
                <a-select
                  v-if="item.type === FormItemType.select && item.selectOption"
                  v-model="formValue[item.field]"
                  :options="item.selectOption.dataOption as any"
                  :field-names="item.selectOption.dataOptionKey as any"
                  :placeholder="item.placeholder"
                  :allow-clear="item.selectOption.allowClear"
                  :allow-create="item.selectOption.allowCreate"
                  :multiple="item.selectOption.multiple"
                  :allow-search="item.selectOption.allowSearch"
                  :max-tag-count="item.selectOption.maxTagCount"
                  :style="getItemStyle(item)"
                  style="position: relative"
                />
                <a-tree-select
                  v-if="item.type === FormItemType.treeSelect && item.selectOption"
                  v-model="formValue[item.field]"
                  :field-names="item.selectOption.dataOptionKey as any"
                  :allow-clear="item.selectOption.allowClear"
                  :multiple="item.selectOption.multiple"
                  :allow-search="item.selectOption.allowSearch"
                  :data="item.selectOption.dataOption as any"
                  :placeholder="item.placeholder"
                  :max-tag-count="item.selectOption.maxTagCount"
                  :style="getItemStyle(item)"
                />
                <a-date-picker
                  v-if="item.type === FormItemType.datePicker"
                  v-model="formValue[item.field]"
                  :style="getItemStyle(item)"
                />
                <a-textarea
                  v-if="item.type === FormItemType.textarea"
                  v-model="formValue[item.field]"
                  :disabled="unref(item.disabled)"
                  allow-clear
                  :auto-size="item.textAreaAutoSize"
                  :style="getItemStyle(item)"
                />
                <a-radio-group
                  v-if="item.type === FormItemType.radio && item.selectOption"
                  v-model="formValue[item.field]"
                  :style="getItemStyle(item)"
                  :options="item.selectOption.dataOption as dataOptionTypeRadio"
                  :disabled="unref(item.disabled)"
                />
                <a-input-number
                  v-if="item.type === FormItemType.inputNumber"
                  v-model="formValue[item.field]"
                  :mode="item.inputNumberMode"
                  :style="getItemStyle(item)"
                  :min="item.inputNumberOptions?.min"
                  :max="item.inputNumberOptions?.max"
                  :step="item.inputNumberOptions?.step"
                  :precision="item.inputNumberOptions?.precision"
                  :default-value="item.inputNumberOptions?.defaultValue"
                  :disabled="unref(item.disabled)"
                />

                <a-checkbox-group
                  v-if="item.type === FormItemType.checkboxGroup && item.selectOption"
                  v-model="formValue[item.field]"
                  :default-value="item.selectOption.defaultValue"
                  :options="item.selectOption.dataOption as any"
                  :disabled="unref(item.disabled)"
                />
                <!--   添加一个slot 用于自定义，更加自由 -->
                <!--   一些比较简单的直接配置，不好配置的使用slot -->
                <slot
                  v-if="item.type === FormItemType.slot && item.slotName"
                  :name="item.slotName"
                  :style="getItemStyle(item)"
                />
                <template v-if="item.type === FormItemType.render && item.renderX">
                  <component :is="item.renderX" />
                </template>
              </a-form-item>
            </a-grid-item>
          </a-grid>
        </a-form>
      </div>
    </a-scrollbar>
  </a-modal>
</template>
