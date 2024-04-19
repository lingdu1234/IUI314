<script setup lang="ts">
import { computed, h, onActivated, onDeactivated, onMounted, ref } from 'vue'
import { IconClose, IconDelete } from '@arco-design/web-vue/es/icon'
import { useIntervalFn } from '@vueuse/core'
import { hasPermission } from '@/hooks'
import { ApiSysPost } from '@/api/sysApis'
import IuButton from '@/components/iui/iu-button.vue'
import type { iuButtonPropsType } from '@/components/iui/iui-props'
import { router } from '@/router'
import { TabAction } from '@/components/layout/tab-bar/useTabBar'
import { useTabBarStore } from '@/stores'

defineOptions({ name: 'ScheduledLogOperator' })

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
  'handleClean',
])

const tabBarStore = useTabBarStore()

const operateButtons = ref<iuButtonPropsType[]>([
  {
    label: '删除',
    icon: h(IconDelete),
    auth: computed(() => hasPermission(ApiSysPost.delete)),
    disabled: computed(() => !props.selected),
    fn: () => emits('handleDelete'),
    type: 'primary',
    status: 'danger',
  },
  {
    label: '清空',
    icon: h(IconDelete),
    auth: computed(() => hasPermission(ApiSysPost.edit)),
    fn: () => emits('handleClean'),
    type: 'primary',
    status: 'warning',
  },
  {
    label: '关闭',
    icon: h(IconClose),
    auth: true,
    disabled: false,
    fn: handleClose,
    type: 'primary',
    status: 'normal',
  },
  {
    slotName: 'reFresh',
    isSlot: true,
  },
])

function handleClose() {
  // 路由回退
  router.back()
  // 关闭当前标签
  tabBarStore.tabActionSelect(tabBarStore.getCurrentRouteTag(), TabAction.current)
}

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
