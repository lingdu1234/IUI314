<script lang="ts" setup>
import { ref } from 'vue'

import type { Size } from '@arco-design/web-vue'
import { useAppStore } from '@/stores'

defineOptions({ name: 'NavBarSize' })

const appStore = useAppStore()

const sizeList = ref<{ key: Size, value: string }[]>([
  { key: 'mini', value: '迷你' },
  { key: 'small', value: '较小' },
  { key: 'medium', value: '正常' },
  { key: 'large', value: '较大' },
])
</script>

<template>
  <div>
    <a-dropdown trigger="hover">
      <div class="cursor-pointer">
        <IconOriginalSize />
      </div>
      <template #content>
        <a-doption
          v-for="size in sizeList"
          :key="size.key"
          @click="appStore.setAppSize(size.key)"
        >
          {{ size.value }}
        </a-doption>
      </template>
    </a-dropdown>
  </div>
</template>
