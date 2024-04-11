<script setup lang="ts">
import { computed, markRaw, ref } from 'vue'
import { IconDelete, IconEdit, IconPlus } from '@arco-design/web-vue/es/icon'
import { useI18n } from 'vue-i18n'
import { hasPermission } from '@/hooks'
import { ApiSysRole } from '@/api/sysApis'
import IuButton from '@/components/iui/iu-button.vue'
import type { MessageSchema } from '@/i18n'

defineOptions({ name: 'RoleManageOperator' })

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

const emits = defineEmits(['handAdd', 'handleUpdate', 'handleDelete'])

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })

const operateButtons = ref<{ [key: string]: any }[]>([
  {
    label: t('common.add'),
    icon: markRaw(IconPlus),
    auth: computed(() => hasPermission(ApiSysRole.add)),
    disabled: false,
    fn: () => emits('handAdd'),
    buttonType: 'primary',
    buttonStatus: 'normal',
  },
  {
    label: t('common.edit'),
    icon: markRaw(IconEdit),
    auth: computed(() => hasPermission(ApiSysRole.edit)),
    disabled: computed(() => !props.single),
    fn: () => emits('handleUpdate'),
    buttonType: 'primary',
    buttonStatus: 'warning',
  },
  {
    label: t('common.delete'),
    icon: markRaw(IconDelete),
    auth: computed(() => hasPermission(ApiSysRole.delete)),
    disabled: computed(() => !props.selected),
    fn: () => emits('handleDelete'),
    buttonType: 'primary',
    buttonStatus: 'danger',
  },
])
</script>

<template>
  <a-col v-for="(item, index) in operateButtons" :key="index" :span="1.5">
    <IuButton
      :auth="item.auth"
      :label="item.label"
      :icon="item.icon"
      :disabled="item.disabled"
      :type="item.buttonType"
      :status="item.buttonStatus"
      :fn="item.fn"
    />
  </a-col>
</template>

<style scoped lang="scss">

</style>
