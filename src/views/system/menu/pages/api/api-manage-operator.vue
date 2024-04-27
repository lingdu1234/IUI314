<script setup lang="ts">
import { IconClose, IconDelete, IconPlus } from '@arco-design/web-vue/es/icon'
import { computed, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { ApiSysMenu } from '@/api/sysApis'
import IuButton from '@/components/iui/iu-button.vue'
import type { iuButtonPropsType } from '@/components/iui/iui-props'
import { TabAction } from '@/components/layout/tab-bar/useTabBar'
import { hasPermission } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { router } from '@/router'
import { useTabBarStore } from '@/stores'
import { MenuType } from '@/types/base/router'

defineOptions({ name: 'ApiManageOperator' })

const props = defineProps({
  pid: {
    type: String,
    default: '0',
  },
  selected: {
    type: Boolean,
    required: true,
  },
})

const emits = defineEmits(['handAdd', 'handleDelete'])

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
const tabBarStore = useTabBarStore()
function handleClose() {
  // 路由回退
  router.back()
  // 关闭当前标签
  tabBarStore.tabActionSelect(tabBarStore.getCurrentRouteTag(), TabAction.current)
}

const operateButtons = computed<iuButtonPropsType[]>(() => [
  {
    label: t('sys.add'),
    icon: h(IconPlus),
    auth: computed(() => hasPermission(ApiSysMenu.add)),
    disabled: false,
    fn: () => emits('handAdd', null, props.pid, MenuType.F),
    type: 'primary',
    status: 'normal',
  },
  {
    label: t('sys.delete'),
    icon: h(IconDelete),
    auth: computed(() => hasPermission(ApiSysMenu.delete)),
    disabled: computed(() => !props.selected),
    fn: () => emits('handleDelete'),
    type: 'primary',
    status: 'danger',
  },
  {
    label: '关闭',
    icon: h(IconClose),
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
