<template>
  <div class="login-container w-100% flex justify-center">
    <!-- 解锁区域 -->
    <div>
      <div
        class="flex items-center justify-center m-t-40px cursor-pointer"
        @click="unLockScreen"
      >
        <div
          class="logo_circle flex items-center justify-center w-256px h-256px"
        >
          <img :src="logo" alt="logo" class="w-128px h-128px" />
        </div>
      </div>
      <!-- 充电区域 -->
      <ReCharge />
      <!-- 时间区域 -->
      <LockScreenTime />
    </div>
  </div>
</template>

<script lang="ts" setup name="app-lock-screen">
import logo from '@/assets/logo.svg'
import { useAppStore } from '@/stores'

import LockScreenTime from './lock-screen-time.vue'
import ReCharge from './re-charge.vue'

const appStore = useAppStore()

const unLockScreen = () => {
  appStore.setIsLocked(false)
}
</script>
