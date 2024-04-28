<script setup lang="ts">
import { IconDelete, IconEdit, IconPlus } from '@arco-design/web-vue/es/icon'
import { computed, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { ApiSysDictType } from '@/api/sysApis'
import IuButton from '@/components/iui/iu-button.vue'
import { hasPermission } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import type { iuButtonPropsType } from '@/components/iui/iui-props'

defineOptions({ name: 'DictTypeManageOperator' })

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

const operateButtons = computed<iuButtonPropsType[]>(() => [
  {
    label: t('sys.add'),
    icon: h(IconPlus),
    auth: computed(() => hasPermission(ApiSysDictType.add)),
    disabled: false,
    fn: () => emits('handAdd'),
    type: 'primary',
    status: 'normal',
  },
  {
    label: t('sys.edit'),
    icon: h(IconEdit),
    auth: computed(() => hasPermission(ApiSysDictType.edit)),
    disabled: computed(() => !props.single),
    fn: () => emits('handleUpdate'),
    type: 'primary',
    status: 'warning',
  },
  {
    label: t('sys.delete'),
    icon: h(IconDelete),
    auth: computed(() => hasPermission(ApiSysDictType.delete)),
    disabled: computed(() => !props.selected),
    fn: () => emits('handleDelete'),
    type: 'primary',
    status: 'danger',
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
      :type="item.type"
      :status="item.status"
      :fn="item.fn"
    />
  </a-col>
</template>

<style scoped lang="scss">

</style>
