<template>
  <div class="switch" id="switch-cnt">
    <div class="switch__circle"></div>
    <div class="switch__circle switch__circle--t"></div>
    <div class="switch__container" id="switch-c1">
      <h2 class="title">Welcome Back !</h2>
    </div>
    <div class="flex items-center justify-center m-t-100px">
      <img
        :src="logo22"
        alt="logo"
        :class="
          appStore.app.isDark ? 'filter-grayscale-50' : 'filter-grayscale-0'
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import logo22 from '@/assets/av2.webp'
import { useAppStore } from '@/stores'
const appStore = useAppStore()
</script>

<style lang="scss" scoped>
// @import '@/assets/css/login.scss';
.switch {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 400px;

  padding: 50px;
  z-index: 200;
  transition: var(--login-neu-transition);

  background-color: var(--login-neu-1);
  overflow: hidden;

  box-shadow: 4px 4px 10px var(--login-neu-2), -4px -4px 10px var(--login-white);

  &__circle {
    position: absolute;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background-color: var(--login-neu-1);
    box-shadow: inset 8px 8px 12px var(--login-neu-2),
      inset -8px -8px 12px var(--login-white);

    bottom: -60%;
    left: -60%;
    transition: var(--login-neu-transition);

    &--t {
      top: -30%;
      left: 60%;
      width: 300px;
      height: 300px;
    }
  }

  &__container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: absolute;
    width: 400px;
    padding: 50px 55px;
    margin-top: -280px;

    transition: var(--login-neu-transition);
  }
}
.title {
  font-size: 34px;
  font-weight: 700;
  line-height: 3;
  color: var(--login-black);
}
</style>
