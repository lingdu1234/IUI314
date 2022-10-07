<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-01 16:32:14
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-07 14:39:03
 * @FilePath: \IUI314\src\components\layout\nav-bar\nav-bar.vue
 * @Description: 
-->
<template>
  <div class="relative w-100% nav-bar-container">
    <div class="flex items-center justify-between">
      <div
        class="m-t-0px m-b-5px flex items-center justify-start nav-bar-box-scroll"
      >
        <div class="cursor-pointer">
          <side-bar-toggle />
        </div>
        <Breadcrumb />
      </div>
      <NavBarOperator />
    </div>
  </div>
</template>

<script lang="ts" setup name="nav-bar">
import Breadcrumb from './breadcrumb.vue'
import NavBarOperator from './nav-bar-operator.vue'
import SideBarToggle from './side-bar-toggle.vue'
</script>

<style lang="scss" scoped>
.nav-bar-container {
  background-color: var(--header-bar-bg-color);
  .nav-bar-box-scroll {
    padding: 1px 0px;
    width: calc(100% - var(--nav-bar-operation-width));
  }
}
</style>
