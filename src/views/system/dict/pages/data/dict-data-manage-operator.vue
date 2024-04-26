<script setup lang="ts">
import { IconClose, IconDelete, IconEdit, IconPlus } from '@arco-design/web-vue/es/icon'
import { computed, h, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ApiSysDictData } from '@/api/sysApis'
import IuButton from '@/components/iui/iu-button.vue'
import type { iuButtonPropsType } from '@/components/iui/iui-props'
import { TabAction } from '@/components/layout/tab-bar/useTabBar'
import { hasPermission } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { router } from '@/router'
import { useTabBarStore } from '@/stores'

defineOptions({ name: 'DictDataManageOperator' })

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

const emits = defineEmits(['handleAdd', 'handleUpdate', 'handleDelete'])
const tabBarStore = useTabBarStore()
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })

function handleClose() {
  // 路由回退
  router.back()
  // 关闭当前标签
  tabBarStore.tabActionSelect(tabBarStore.getCurrentRouteTag(), TabAction.current)
}

const operateButtons = ref<iuButtonPropsType[]>([
  {
    label: t('sys.add'),
    icon: h(IconPlus),
    auth: computed(() => hasPermission(ApiSysDictData.add)),
    disabled: false,
    fn: () => emits('handleAdd'),
    type: 'primary',
    status: 'normal',
  },
  {
    label: t('sys.edit'),
    icon: h(IconEdit),
    auth: computed(() => hasPermission(ApiSysDictData.edit)),
    disabled: computed(() => !props.single),
    fn: () => emits('handleUpdate'),
    type: 'primary',
    status: 'warning',
  },
  {
    label: t('sys.delete'),
    icon: h(IconDelete),
    auth: computed(() => hasPermission(ApiSysDictData.delete)),
    disabled: computed(() => !props.selected),
    fn: () => emits('handleDelete'),
    type: 'primary',
    status: 'danger',
  },
  {
    label: t('sys.close'),
    icon: h(IconClose),
    auth: true,
    disabled: false,
    fn: handleClose,
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
      :type="item.type"
      :status="item.status"
      :fn="item.fn"
    />
  </a-col>
</template>

<style scoped lang="scss">

</style>
