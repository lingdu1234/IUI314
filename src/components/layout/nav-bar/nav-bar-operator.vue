<script lang="ts"  setup>
import NavBarUser from './nav-bar-user.vue'
import NavBarLanguage from '@/components/app/nav-bar-language.vue'
import NavBarLock from '@/components/app/nav-bar-lock.vue'
import NavBarSize from '@/components/app/nav-bar-size.vue'
import NavBarTheme from '@/components/app/nav-bar-theme.vue'
import ScreenFull from '@/components/app/screen-full.vue'
import AppAnimation from '@/components/app/app-animation.vue'

defineOptions({ name: 'NavBarOperator' })
</script>

<template>
  <div class="flex items-center justify-end m-r-10px">
    <div class="nav-bar-operator flex justify-evenly items-center">
      <AppAnimation />
      <NavBarLock />
      <NavBarLanguage />
      <NavBarTheme />
      <ScreenFull />
      <NavBarSize />
    </div>
    <div>
      <NavBarUser />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav-bar-operator {
  width: var(--nav-bar-operation-width);
}
</style>
