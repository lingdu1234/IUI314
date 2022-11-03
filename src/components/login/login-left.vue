<template>
  <div class="w-100% flex justify-center items-center m-t-30px">
    <div
      class="login-left-container h-450px w-400px flex justify-center items-center b-rd-20px"
    >
      <div
        class="login-left-container__circle flex items-center justify-center"
      >
        <img :src="logo" alt="logo" class="w-128px h-128px" />
      </div>
      <div class="m-t-250px m-l-30px">
        <h2 class="title m-l-10px">Welcome Back !</h2>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup name="login-left">
import logo from '@/assets/logo.svg'
</script>
<style lang="scss" scoped>
.login-left-container {
  background-color: var(--login-neu-1);
  overflow: hidden;

  box-shadow: 4px 4px 10px var(--login-neu-2), -4px -4px 10px var(--login-white);

  &__circle {
    width: 250px;
    height: 250px;
    border-radius: 50%;
    margin-top: -150px;
    margin-right: -300px;
    background-color: var(--login-neu-1);
    box-shadow: inset 8px 8px 12px var(--login-neu-2),
      inset -8px -8px 12px var(--login-white);
  }
}
.title {
  font-size: 34px;
  font-weight: 700;
  line-height: 3;
  color: var(--login-black);
}
</style>
