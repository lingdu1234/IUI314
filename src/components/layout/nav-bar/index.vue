<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-01 16:32:14
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-04 13:26:46
 * @FilePath: \IUI314\src\components\layout\nav-bar\index.vue
 * @Description: 
-->
<template>
  <div class="flex justify-start items-center">
    <div class="cursor-pointer">
      <side-bar-toggle />
    </div>
    <div>
      <Breadcrumb />
    </div>
  </div>
  <NavBarOperator />
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
