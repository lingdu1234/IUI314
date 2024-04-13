<script lang="ts" setup>
import { useAppStore } from '@/stores'

defineOptions({ name: 'AppSettings' })
const appStore = useAppStore()
</script>

<template>
  <div>
    <div class="cursor-pointer">
      <IconSettings
        @click="appStore.setAppSettingDrawer(true)"
      />
    </div>
  </div>
</template>
