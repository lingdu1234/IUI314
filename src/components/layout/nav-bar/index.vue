<template>
  <div class="flex justify-start items-center">
    <div class="cursor-pointer">
      <side-bar-toggle />
    </div>
    <div>
      <Breadcrumb />
    </div>
  </div>
  <div class="w-300px flex items-center justify-end">
    <NavBarOperator />
  </div>
</template>

<script lang="ts" setup name="nav-bar">
import Breadcrumb from './breadcrumb.vue'
import NavBarOperator from './nav-bar-operator.vue'
import SideBarToggle from './side-bar-toggle.vue'
</script>

<style lang="scss" scoped>
// .fixed-header {
//   position: fixed;
//   top: 0;
//   right: 0;
//   z-index: 9;
//   transition: width 0.28s;
// }
</style>
