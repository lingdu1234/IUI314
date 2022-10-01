<template>
  <el-menu
    :default-active="activeMenu"
    :collapse="isCollapse"
    :unique-opened="true"
    mode="vertical"
  >
    <SideBarMenuItem
      v-for="(router, index) in routes"
      :key="router.path + index"
      :item="router"
      :base-path="router.path"
    />
  </el-menu>
</template>
<script lang="ts" setup name="side-bar-menu">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

import { constantRoutes as routes } from '@/router';

// import { testRoutes as routes } from "@/router/test_menu";
import SideBarMenuItem from './side-bar-menu-item.vue';

const isCollapse = ref(false);

const route = useRoute();
const activeMenu = computed(() => {
  const { meta, path } = route;
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
});
</script>
