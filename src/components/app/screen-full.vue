<script lang="ts" setup>
import { useAppStore } from '@/stores'

defineOptions({ name: 'ScreenFull' })

const appStore = useAppStore()
</script>

<template>
  <div>
    <div class="cursor-pointer" @click="appStore.toggleFullScreen">
      <IconFullscreenExit v-if="appStore.app.isFullscreen" />
      <IconFullscreen v-else />
    </div>
  </div>
</template>
