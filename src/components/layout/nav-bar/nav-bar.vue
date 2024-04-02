<script lang="ts"  setup>
import Breadcrumb from './breadcrumb.vue'
import NavBarOperator from './nav-bar-operator.vue'
import SideBarToggle from './side-bar-toggle.vue'

defineOptions({ name: 'NavBar' })
</script>

<template>
  <div class="relative w-100% p-l-10px nav-bar-container">
    <div class="flex items-center justify-between">
      <div
        class="m-t-0px m-b-5px flex items-center justify-start nav-bar-box-scroll"
      >
        <div class="cursor-pointer">
          <SideBarToggle />
        </div>
        <Breadcrumb />
      </div>
      <NavBarOperator />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav-bar-container {
  background-color: var(--header-bar-bg-color);

  .nav-bar-box-scroll {
    padding: 1px 0;
    width: calc(100% - var(--nav-bar-operation-width));
  }
}
</style>
