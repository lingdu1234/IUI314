<template>
  <div class="login-container w-100% flex flex-col justify-between">
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
            <img :src="logo" alt="logo" class="lockLogo" />
          </div>
        </div>
      </div>

      <!-- 充电区域 -->
      <ReCharge />
    </div>
    <!-- 时间区域 -->
    <LockScreenTime />
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
<style lang="scss" scoped>
.lockLogoContainer {
  height: calc(var(--vh) * 25);
}
.lockLogoContainer2 {
  height: calc(var(--vh) * 24);
  width: calc(var(--vh) * 24);
}
.lockLogo {
  height: calc(var(--vh) * 18);
  width: calc(var(--vh) * 18);
}
</style>
