<script setup lang="ts">
import type { FormInstance } from '@arco-design/web-vue'
import { computed, ref, unref } from 'vue'
import type { iuModalPropsType } from '@/components/iui/iui-props'
import { useFormUtil, useMobile, useOrientation } from '@/hooks'
import { FormItemType, type IuFormField } from '@/types/base/iu-form'

defineOptions({ name: 'IuModal' })

const props = withDefaults(defineProps<iuModalPropsType>(), {
  title: '',
  titleAlign: 'center',
  labelWidth: 100,
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
                  :placeholder="item?.input?.placeholder"
                  :disabled="unref(item?.input?.disabled)"
                  :allow-clear="item?.input?.allowClear"
                  :readonly="item?.input?.readonly"
                  :size="item?.input?.size"
                  :type="item?.input?.type"
                  :style="getItemStyle(item)"
                />
                <a-select
                  v-if="item.type === FormItemType.select && item.select"
                  v-model:model-value="formValue[item.field]"
                  :options="unref(item?.select?.options)"
                  :field-names="item?.select?.fieldNames"
                  :placeholder="item?.select?.placeholder"
                  :allow-clear="item?.select?.allowClear"
                  :multiple="item?.select?.multiple"
                  :allow-search="item?.select?.allowSearch"
                  :allow-create="item.select.allowCreate"
                  :max-tag-count="item.select.maxTagCount"
                  :style="getItemStyle(item)"
                  style="position: relative"
                />
                <a-tree-select
                  v-if="item.type === FormItemType.treeSelect && item.treeSelect"
                  v-model:model-value="formValue[item.field]"
                  :data="unref(item?.treeSelect?.data)"
                  :field-names="item?.treeSelect?.fieldNames"
                  :placeholder="item?.treeSelect?.placeholder"
                  :allow-clear="item?.treeSelect?.allowClear"
                  :multiple="item?.treeSelect?.multiple"
                  :allow-search="item?.treeSelect?.allowSearch"
                  :allow-create="item.treeSelect.allowCreate"
                  :max-tag-count="item.treeSelect.maxTagCount"
                  :style="getItemStyle(item)"
                />
                <a-date-picker
                  v-if="item.type === FormItemType.datePicker"
                  v-model="formValue[item.field]"
                  :position="item?.datePicker?.position"
                  :allow-clear="item?.datePicker?.allowClear"
                  :readonly="item?.datePicker?.readonly"
                  :style="getItemStyle(item)"
                />
                <a-textarea
                  v-if="item.type === FormItemType.textarea"
                  v-model="formValue[item.field]"
                  :disabled="unref(item?.textArea?.disabled)"
                  :allow-clear="unref(item?.textArea?.allowClear)"
                  :auto-size="unref(item?.textArea?.autoSize)"
                  :style="getItemStyle(item)"
                />
                <a-radio-group
                  v-if="item.type === FormItemType.radioGroup && item.radioGroup"
                  v-model:model-value="formValue[item.field]"
                  :default-value="item.radioGroup?.defaultValue"
                  :options="unref(item.radioGroup?.options)"
                  :type="item.radioGroup?.type"
                  :disabled="unref(item.radioGroup?.disabled)"
                  :style="item.radioGroup?.type !== 'button' ? getItemStyle(item) : null"
                />
                <a-input-number
                  v-if="item.type === FormItemType.inputNumber"
                  v-model="formValue[item.field]"
                  :mode="item.inputNumber?.mode"
                  :min="item.inputNumber?.min"
                  :max="item.inputNumber?.max"
                  :step="item.inputNumber?.step"
                  :precision="item.inputNumber?.precision"
                  :default-value="item.inputNumber?.defaultValue"
                  :disabled="unref(item.inputNumber?.disabled)"
                  :style="getItemStyle(item)"
                />

                <a-checkbox-group
                  v-if="item.type === FormItemType.checkboxGroup && item.checkboxGroup"
                  v-model="formValue[item.field]"
                  :default-value="item.checkboxGroup?.defaultValue"
                  :options="item.checkboxGroup.options"
                  :max="item.checkboxGroup?.max"
                  :disabled="unref(item.radioGroup?.disabled)"
                  :style="getItemStyle(item)"
                />
                <!--   添加一个slot 用于自定义，更加自由 -->
                <!--   一些比较简单的直接配置，不好配置的使用slot -->
                <slot
                  v-if="item.type === FormItemType.slot && item.slotName"
                  :name="item.slotName"
                  :style="getItemStyle(item)"
                />
                <template v-if="item.type === FormItemType.render && item.renderX">
                  <component :is="item.renderX" :style="getItemStyle(item)" />
                </template>
              </a-form-item>
            </a-grid-item>
          </a-grid>
        </a-form>
      </div>
    </a-scrollbar>
  </a-modal>
</template>
