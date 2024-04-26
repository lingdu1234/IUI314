<script setup lang="ts">
import { IconPlus } from '@arco-design/web-vue/es/icon'
import { computed, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { ApiSysDept } from '@/api/sysApis'
import IuButton from '@/components/iui/iu-button.vue'
import type { iuButtonPropsType } from '@/components/iui/iui-props'
import { hasPermission } from '@/hooks'
import type { MessageSchema } from '@/i18n'

defineOptions({ name: 'DeptManageOperator' })

const emits = defineEmits(['handAdd'])

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })

const operateButtons = computed<iuButtonPropsType[]>(() => [
  {
    label: t('sys.add'),
    icon: h(IconPlus),
    auth: computed(() => hasPermission(ApiSysDept.add)),
    disabled: false,
    fn: () => emits('handAdd'),
    type: 'primary',
    status: 'normal',
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
      :type="item.type as any"
      :status="item.status as any"
      :fn="item.fn"
    />
  </a-col>
</template>

<style scoped lang="scss">

</style>
