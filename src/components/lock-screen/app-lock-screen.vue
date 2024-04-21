<script lang="ts" setup>
import { useBattery } from '@vueuse/core'
import { computed } from 'vue'

import LockScreenTime from './lock-screen-time.vue'
import logo from '@/assets/logo.svg'
import { useSetVh, useTheme } from '@/hooks'
import { useAppStore } from '@/stores'

defineOptions({ name: 'AppLockScreen' })

const appStore = useAppStore()
useTheme()
const { level } = useBattery()
const { vHeight } = useSetVh()

const scale = computed(() => {
  let v = vHeight.value / 400
  if (v > 1)
    v = 1

  return `scale(${v})`
})

function unLockScreen() {
  appStore.setIsLocked(false)
}
</script>

<template>
  <a-scrollbar style="height: 100vh;overflow: auto;">
    <div class="w-100% flex flex-col justify-between login-container" style="height: 100vh">
      <div>
        <!-- 解锁区域 -->
        <div class="flex items-center justify-center lockLogoContainer">
          <div
            class="flex items-center justify-center m-t-10px cursor-pointer"
            @click="unLockScreen"
          >
            <div
              class="logo_circle flex items-center justify-center lockLogoContainer2"
            >
              <img :src="logo" alt="logo" class="lockLogo">
            </div>
          </div>
        </div>

        <!-- 充电区域 -->
        <div class="flex flex-col items-center justify-center">
          <div class="g-container">
            <div class="g-number">
              {{ level * 100 }} %
            </div>
            <div class="g-contrast">
              <div class="g-circle" />
              <ul class="g-bubbles">
                <li v-for="i in 15" :key="i" />
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!-- 时间区域 -->
      <LockScreenTime />
    </div>
  </a-scrollbar>
</template>

<style lang="scss" scoped>
.lockLogoContainer {
  height: 260px;
  transform: v-bind(scale);
}
.lockLogoContainer2 {
  height: 250px;
  width: 250px;
}
.lockLogo {
  height: 165px;
  width: 165px;
}
.g-number {
  position: absolute;
  width: 300px;
  top: 27%;
  text-align: center;
  font-size: 32px;
  z-index: 10;
}

.g-container {
  position: relative;
  width: 300px;
  height: 400px;
  margin: auto;
  transform: v-bind(scale);
}

.g-contrast {
  filter: contrast(10) hue-rotate(0);
  width: 300px;
  height: 400px;
  background-color: #1f232e00;
  overflow: hidden;
  animation: hueRotate 10s infinite linear;
}

.g-circle {
  position: relative;
  width: 300px;
  height: 300px;
  box-sizing: border-box;
  filter: blur(8px);

  &::after {
    content: '';
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(0);
    width: 200px;
    height: 200px;
    background-color: #00ff6f;
    border-radius: 42% 38% 62% 49% / 45%;
    animation: rotate 10s infinite linear;
  }

  &::before {
    content: '';
    position: absolute;
    width: 176px;
    height: 176px;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background-color: var(--second-bg-color);
    z-index: 10;
  }
}

.g-bubbles {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 100px;
  height: 40px;
  transform: translate(-50%, 0);
  border-radius: 100px 100px 0 0;
  background-color: #00ff6f;
  filter: blur(5px);
}

li {
  position: absolute;
  border-radius: 50%;
  background: #00ff6f;
}

@for $i from 0 through 15 {
  li:nth-child(#{$i}) {
    $width: 15 + random(15) + px;
    left: 15 + random(70) + px;
    top: 50%;
    transform: translate(-50%, -50%);
    width: $width;
    height: $width;
    animation: moveToTop
      #{random(6) +
      3}s
      ease-in-out -#{calc(random(5000) / 1000)}s
      infinite;
  }
}

@keyframes rotate {
  50% {
    border-radius: 45% / 42% 38% 58% 49%;
  }
  100% {
    transform: translate(-50%, -50%) rotate(720deg);
  }
}

@keyframes moveToTop {
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0.1;
    transform: translate(-50%, -180px);
  }
}

@keyframes hueRotate {
  100% {
    filter: contrast(15) hue-rotate(360deg);
  }
}
</style>
