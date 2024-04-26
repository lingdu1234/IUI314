<script setup lang="ts">
import { IconDelete, IconEdit, IconPlus } from '@arco-design/web-vue/es/icon'
import { useIntervalFn } from '@vueuse/core'
import { computed, h, onActivated, onDeactivated, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ApiSysPost } from '@/api/sysApis'
import IuButton from '@/components/iui/iu-button.vue'
import type { iuButtonPropsType } from '@/components/iui/iui-props'
import { hasPermission } from '@/hooks'
import type { MessageSchema } from '@/i18n'

defineOptions({ name: 'ScheduledTasksOperator' })

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
  'handAdd',
  'handleUpdate',
  'handleDelete',
])

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })

const operateButtons = ref<iuButtonPropsType[]>([
  {
    label: t('sys.add'),
    icon: h(IconPlus),
    auth: computed(() => hasPermission(ApiSysPost.add)),
    disabled: false,
    fn: () => emits('handAdd'),
    type: 'primary',
    status: 'normal',
  },
  {
    label: t('sys.edit'),
    icon: h(IconEdit),
    auth: computed(() => hasPermission(ApiSysPost.edit)),
    disabled: computed(() => !props.single),
    fn: () => emits('handleUpdate'),
    type: 'primary',
    status: 'warning',
  },
  {
    label: t('sys.delete'),
    icon: h(IconDelete),
    auth: computed(() => hasPermission(ApiSysPost.delete)),
    disabled: computed(() => !props.selected),
    fn: () => emits('handleDelete'),
    type: 'primary',
    status: 'danger',
  },
  {
    slotName: 'reFresh',
    isSlot: true,
  },
])
const fresh_enabled = ref(false)
const { pause, resume } = useIntervalFn(() => emits('getList'), 1500)
function handleRefresh(v: boolean | (string | number | boolean)[]) {
  (v as boolean) ? resume() : pause()
}
onDeactivated(() => {
  pause()
})
onActivated(() => {
  fresh_enabled.value
    ? resume()
    : pause()
})
onMounted(() => {
  fresh_enabled.value
    ? resume()
    : pause()
})
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
    >
      <template #reFresh>
        <a-button type="dashed">
          <a-checkbox v-model="fresh_enabled" @change="handleRefresh">
            自动刷新
          </a-checkbox>
          <template #icon>
            <IconRefresh />
          </template>
        </a-button>
      </template>
    </IuButton>
  </a-col>
</template>

<style scoped lang="scss">

</style>
