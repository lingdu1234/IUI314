<script setup lang="ts">
import { Message, Modal } from '@arco-design/web-vue'
import { IconDelete } from '@arco-design/web-vue/es/icon'
import { computed, h, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ApiSysOperateLog } from '@/api/sysApis'
import IuButton from '@/components/iui/iu-button.vue'
import type { iuButtonPropsType } from '@/components/iui/iui-props'
import { hasPermission, useDelete } from '@/hooks'
import type { MessageSchema } from '@/i18n'

defineOptions({ name: 'OperateLogOperator' })

const props = defineProps({
  single: {
    type: Boolean,
    required: true,
  },
  selected: {
    type: Boolean,
    required: true,
  },
})

const emits = defineEmits([
  'getList',
  'handleDelete',
])

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })

const operateButtons = ref<iuButtonPropsType[]>([
  {
    label: t('sys.delete'),
    icon: h(IconDelete),
    auth: computed(() => hasPermission(ApiSysOperateLog.delete)),
    disabled: computed(() => !props.selected),
    fn: () => emits('handleDelete'),
    type: 'primary',
    status: 'warning',
  },
  {
    label: t('sys.clean'),
    icon: h(IconDelete),
    auth: computed(() => hasPermission(ApiSysOperateLog.clean)),
    disabled: false,
    fn: () => handleClean,
    type: 'primary',
    status: 'danger',
  },
])

// 清空日志
function handleClean() {
  Modal.warning({
    title: '确认清空',
    hideCancel: false,
    titleAlign: 'start',
    content: '是否确认清空所有操作日志数据项?',
    okText: '确认',
    cancelText: '取消',
    draggable: true,
    onOk: async () => {
      const { execute } = useDelete(ApiSysOperateLog.clean)
      await execute()
      Message.success('清空日志成功')
      emits('getList')
    },
    onCancel: async () => Message.info('取消清空操作'),
  })
}
</script>

<template>
  <a-col v-for="(item, index) in operateButtons" :key="index" :span="1.5">
    <IuButton
      :auth="item.auth"
      :label="item.label"
      :icon="item.icon"
      :disabled="item.disabled"
      :type="item.type"
      :status="item.status"
      :is-slot="item.isSlot"
      :slot-name="item.slotName"
      :fn="item.fn"
    />
  </a-col>
</template>
