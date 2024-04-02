<script lang="ts" setup>
import SvgIcon from '../common/svg-icon.vue'
import { useAppStore } from '@/stores'

defineOptions({ name: 'AppSettings' })
const appStore = useAppStore()
</script>

<template>
  <div>
    <div class="cursor-pointer">
      <SvgIcon
        name="app-settings"
        @click="appStore.setAppSettingDrawer(true)"
      />
    </div>
  </div>
</template>
