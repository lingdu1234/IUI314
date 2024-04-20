<script lang="ts" setup>
import { useAppStore } from '@/stores'
import { useAnimation } from '@/hooks'

defineOptions({ name: 'AppAnimation' })
const appStore = useAppStore()
const { setAnimation, animationList } = useAnimation()
</script>

<template>
  <div>
    <a-dropdown trigger="hover">
      <div class="cursor-pointer">
        <IconCloud spin />
      </div>
      <template #content>
        <a-doption
          v-for="animation in animationList"
          :key="animation.value"
          @click="setAnimation(animation.value)"
        >
          <span
            :class="appStore.app.animation === animation.value ? 'font-bold' : 'font-normal'"
          >
            {{ animation.label }}
          </span>
        </a-doption>
      </template>
    </a-dropdown>
  </div>
</template>
