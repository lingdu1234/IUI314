<script lang="ts" setup>
import SvgIcon from '../common/svg-icon.vue'
import { useAppStore } from '@/stores'

defineOptions({ name: 'ScreenFull' })

const appStore = useAppStore()
</script>

<template>
  <div>
    <div class="cursor-pointer" @click="appStore.toggleFullScreen">
      <SvgIcon
        :name="appStore.app.isFullscreen ? 'fullscreen-exit' : 'fullscreen'"
      />
    </div>
  </div>
</template>
