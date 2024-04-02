<script lang="ts"  setup>
import { useIdle } from '@vueuse/core'
import { watch } from 'vue'

import { useAppStore } from '@/stores'

defineOptions({ name: 'NavBarLock' })

const appStore = useAppStore()
const { idle } = useIdle(appStore.app.LockedTime)
watch(
  () => idle.value,
  (val) => {
    if (val) {
      // 监控是否无活动,无活动锁屏
      appStore.setIsLocked(true)
    }
  },
)
</script>

<template>
  <div class="cursor-pointer" @click="appStore.setIsLocked(true)">
    <IconLock />
  </div>
</template>
